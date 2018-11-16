
class CircleProgress extends React.Component {
    render () {
        const strokeWidth = this.props.strokeWidth;
        const r = this.props.r;
        const width = this.props.width;
        const height = this.props.height;
        const origin = width / 2;
        const arc = r * 2 * Math.PI;
        const percent = this.props.percent;
        const offset = arc - (2 * Math.PI * percent);
        const color = this.props.color;


        return (
            <circle
                className="temp-ring-circle"
                stroke-width={strokeWidth}
                stroke={color}
                fill="transparent"
                r={r}
                cx={origin}
                cy={origin - 10}
                strokeDasharray={arc}
                strokeDashoffset={offset}
                transform={`rotate(150, ${origin}, ${origin})`}
            />
        );

    }
}

class Temp extends React.Component {
    render() {
        const r = 170;
        const strokeWidth = 20;
        const width = (2 * r) + (strokeWidth * 2);
        const height = width;
        const maxTemp = 40;
        const minTemp = -20;

        function percent(value) {
            return (value - minTemp) / (maxTemp - minTemp) * 100;
        }

        const targetPercent = percent(this.props.target);
        const currentPercent = percent(this.props.current);


        return(
            <div className="temp">
                <div class="temp-display">
                    <p class="target-temp">{this.props.target}&deg;</p>
                    <p class="current-temp">{this.props.current}&deg;</p>
                </div>
                <svg
                    className="temp-ring"
                    height={height}
                    width={width}
                >
                    <CircleProgress width={width} height={height} r={r} strokeWidth={strokeWidth} percent={currentPercent} color={"#fdd835" + "50"}/>
                    <CircleProgress width={width} height={height} r={r} strokeWidth={strokeWidth} percent={targetPercent} color={"#85f434" + "50"}/>
                </svg>
            </div>
        );
    }
}



class ArrowButton extends React.Component {
    render() {
        return(
            <div className={"arrow-button " + this.props.direction}>
                <img src={arrowPath} onClick={() => this.props.onClick()}/>
            </div>
        );
    }
}

class ControlPanel extends React.Component {
    render() {
        return(
            <div className="control-panel">
                <ArrowButton direction="up" onClick={() => this.props.onTempUp()}/>
                <ArrowButton direction="down" onClick={() => this.props.onTempDown()}/>
            </div>
        );
    }
}

class Thermostat extends React.Component {
    constructor(props) {
        super(props);
        var domain = config["hass_url"];
        var pass = config["hass_password"];
        var ssl_extension = config["ssl_enabled"] == "true" ?
            "s" :
            "";
        var climate_id = config["client_id"];
        this.state = {
            target: parseInt(props.target),
            current: parseInt(props.current),
            baseApiUrl: 'http' + ssl_extension + '://' + domain + '/api/',
            webSocketApiUrl: 'ws' + ssl_extension + '://' + domain + '/api/websocket',
            api_password: pass,
            currentId: 3,
            climate_id:
        };
        this.setup();
    }

    render() {

        return(
            <div className="thermostat">
                <Temp target={this.state.target} current={this.state.current}/>
                <ControlPanel onTempUp={() => this.handleTempChange("up")} onTempDown={() => this.handleTempChange("down")}/>
            </div>
        );
    }

    setup() {
        this.connectWebsocket();
    }

    // Fetches the initial state of both target and current temperature
    getInitialState() {
        this.state.ws.send(JSON.stringify({
            id: 1,
            type: "get_states"
        }));
    }

    connectWebsocket() {
        var ws = new WebSocket(this.state.webSocketApiUrl);

        ws.addEventListener('open', function(event) {
            // Authenticate with the websocket api
            ws.send(JSON.stringify(
                {
                 type: "auth",
                  api_password: this.state.api_password
                }
            ));
        }.bind(this));


        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);

            // Hadle end of authentication phase
            if (data["type"] == "auth_ok") {
                // Save the ws connection in the state
                this.setState({
                    ws: ws
                });

                this.getInitialState();

                // Send subscription message to the homeassistant api
                ws.send(JSON.stringify(
                    {
                        id: 2,
                        type: "subscribe_events",
                        event_type: "state_changed",
                    }
                ))
            } else if (data["type"] == "event") {
                // Handle all events sent from the websocket api
                const e = data["event"];
                this.handleWsEvent(e);
            } else if (data["type"] == "result" && data["success"]) {
                //Handle fetch results
                const result = data["result"];
                if (result) {
                    this.handleWsResults(result);
                }
            }
        }.bind(this);


        ws.onclose = function() {
            this.connectWebsocket();
        };

    }


    // Handles all responses to messages sent over ws to homeassistant
    handleWsResults(result) {
        // First we need to loop through all the entities that
        // the homeassistant returns, and then find the entities that we want
        for (var i = 0; i < result.length; i++) {
            const entity = result[i];
            const attributes = entity["attributes"];
            if (entity["entity_id"] == this.state.climate_id) {
                // This is the entity I want at least
                const current = attributes["current_temperature"];
                const target = attributes["temperature"];
                this.setState({
                    current: current,
                    target: target,
                });
            }
        }
    }

    // Handles all event updates from homeassistant ws api
    handleWsEvent(event) {
        if (event["data"]["entity_id"] == this.state.climate_id) {
            const attributes = event["data"]["new_state"]["attributes"];
            const current = attributes["current_temperature"];
            const target = attributes["temperature"];
            this.setState({
                current: current,
                target: target,
            })
        }
    }


    handleTempChange(direction) {
        var value;
        if(direction == "up") {
            value = 0.5;
        } else if (direction == "down"){
            value = -0.5;
        }
        const currentTemp = this.state.target;
        const newTemp = Math.round((currentTemp + value)* 2) / 2;
        this.setState({
            target: newTemp
        });

        this.updateTemperature(newTemp);
    }



    updateTemperature(temp) {
        if (this.state.ws) {
            const id = this.state.currentId;
            this.state.ws.send(JSON.stringify(
                {
                    id: id,
                    type: "call_service",
                    domain: "climate",
                    service: "set_temperature",
                    // Optional
                    service_data: {
                        entity_id: this.state.climate_id,
                        temperature: temp,
                    }
                }
            ));

            this.setState({
                currentId: id + 1,
            })
        }

    }



}


ReactDOM.render(
    <Thermostat target="22" current="21"/>,
    document.getElementById("root")
);
