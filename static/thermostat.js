var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var CircleProgress = function (_React$Component) {
    _inherits(CircleProgress, _React$Component);

    function CircleProgress() {
        _classCallCheck(this, CircleProgress);

        return _possibleConstructorReturn(this, (CircleProgress.__proto__ || Object.getPrototypeOf(CircleProgress)).apply(this, arguments));
    }

    _createClass(CircleProgress, [{
        key: "render",
        value: function render() {
            var strokeWidth = this.props.strokeWidth;
            var r = this.props.r;
            var width = this.props.width;
            var height = this.props.height;
            var origin = width / 2;
            var arc = r * 2 * Math.PI;
            var percent = this.props.percent;
            var offset = arc - 2 * Math.PI * percent;
            var color = this.props.color;

            return React.createElement("circle", {
                className: "temp-ring-circle",
                "stroke-width": strokeWidth,
                stroke: color,
                fill: "transparent",
                r: r,
                cx: origin,
                cy: origin - 10,
                strokeDasharray: arc,
                strokeDashoffset: offset,
                transform: "rotate(150, " + origin + ", " + origin + ")"
            });
        }
    }]);

    return CircleProgress;
}(React.Component);

var Temp = function (_React$Component2) {
    _inherits(Temp, _React$Component2);

    function Temp() {
        _classCallCheck(this, Temp);

        return _possibleConstructorReturn(this, (Temp.__proto__ || Object.getPrototypeOf(Temp)).apply(this, arguments));
    }

    _createClass(Temp, [{
        key: "render",
        value: function render() {
            var r = 170;
            var strokeWidth = 20;
            var width = 2 * r + strokeWidth * 2;
            var height = width;
            var maxTemp = 40;
            var minTemp = -20;

            function percent(value) {
                return (value - minTemp) / (maxTemp - minTemp) * 100;
            }

            var targetPercent = percent(this.props.target);
            var currentPercent = percent(this.props.current);

            return React.createElement(
                "div",
                { className: "temp" },
                React.createElement(
                    "div",
                    { "class": "temp-display" },
                    React.createElement(
                        "p",
                        { "class": "target-temp" },
                        this.props.target,
                        "\xB0"
                    ),
                    React.createElement(
                        "p",
                        { "class": "current-temp" },
                        this.props.current,
                        "\xB0"
                    )
                ),
                React.createElement(
                    "svg",
                    {
                        className: "temp-ring",
                        height: height,
                        width: width
                    },
                    React.createElement(CircleProgress, { width: width, height: height, r: r, strokeWidth: strokeWidth, percent: currentPercent, color: "#fdd835" + "50" }),
                    React.createElement(CircleProgress, { width: width, height: height, r: r, strokeWidth: strokeWidth, percent: targetPercent, color: "#85f434" + "50" })
                )
            );
        }
    }]);

    return Temp;
}(React.Component);

var ArrowButton = function (_React$Component3) {
    _inherits(ArrowButton, _React$Component3);

    function ArrowButton() {
        _classCallCheck(this, ArrowButton);

        return _possibleConstructorReturn(this, (ArrowButton.__proto__ || Object.getPrototypeOf(ArrowButton)).apply(this, arguments));
    }

    _createClass(ArrowButton, [{
        key: "render",
        value: function render() {
            var _this4 = this;

            return React.createElement(
                "div",
                { className: "arrow-button " + this.props.direction },
                React.createElement("img", { src: arrowPath, onClick: function onClick() {
                        return _this4.props.onClick();
                    } })
            );
        }
    }]);

    return ArrowButton;
}(React.Component);

var ControlPanel = function (_React$Component4) {
    _inherits(ControlPanel, _React$Component4);

    function ControlPanel() {
        _classCallCheck(this, ControlPanel);

        return _possibleConstructorReturn(this, (ControlPanel.__proto__ || Object.getPrototypeOf(ControlPanel)).apply(this, arguments));
    }

    _createClass(ControlPanel, [{
        key: "render",
        value: function render() {
            var _this6 = this;

            return React.createElement(
                "div",
                { className: "control-panel" },
                React.createElement(ArrowButton, { direction: "up", onClick: function onClick() {
                        return _this6.props.onTempUp();
                    } }),
                React.createElement(ArrowButton, { direction: "down", onClick: function onClick() {
                        return _this6.props.onTempDown();
                    } })
            );
        }
    }]);

    return ControlPanel;
}(React.Component);

var Thermostat = function (_React$Component5) {
    _inherits(Thermostat, _React$Component5);

    function Thermostat(props) {
        _classCallCheck(this, Thermostat);

        var _this7 = _possibleConstructorReturn(this, (Thermostat.__proto__ || Object.getPrototypeOf(Thermostat)).call(this, props));

        var domain = config["hass_url"];
        var pass = config["hass_password"];
        var ssl_extension = config["ssl_enabled"] == "true" ? "s" : "";
        var climate_id = config["client_id"];
        _this7.state = {
            target: parseInt(props.target),
            current: parseInt(props.current),
            baseApiUrl: 'http' + ssl_extension + '://' + domain + '/api/',
            webSocketApiUrl: 'ws' + ssl_extension + '://' + domain + '/api/websocket',
            api_password: pass,
            currentId: 3,
            climate_id: climate_id
        };
        _this7.setup();
        return _this7;
    }

    _createClass(Thermostat, [{
        key: "render",
        value: function render() {
            var _this8 = this;

            return React.createElement(
                "div",
                { className: "thermostat" },
                React.createElement(Temp, { target: this.state.target, current: this.state.current }),
                React.createElement(ControlPanel, { onTempUp: function onTempUp() {
                        return _this8.handleTempChange("up");
                    }, onTempDown: function onTempDown() {
                        return _this8.handleTempChange("down");
                    } })
            );
        }
    }, {
        key: "setup",
        value: function setup() {
            this.connectWebsocket();
        }

        // Fetches the initial state of both target and current temperature

    }, {
        key: "getInitialState",
        value: function getInitialState() {
            this.state.ws.send(JSON.stringify({
                id: 1,
                type: "get_states"
            }));
        }
    }, {
        key: "connectWebsocket",
        value: function connectWebsocket() {
            var ws = new WebSocket(this.state.webSocketApiUrl);

            ws.addEventListener('open', function (event) {
                // Authenticate with the websocket api
                ws.send(JSON.stringify({
                    type: "auth",
                    api_password: this.state.api_password
                }));
            }.bind(this));

            ws.onmessage = function (event) {
                var data = JSON.parse(event.data);

                // Hadle end of authentication phase
                if (data["type"] == "auth_ok") {
                    // Save the ws connection in the state
                    this.setState({
                        ws: ws
                    });

                    this.getInitialState();

                    // Send subscription message to the homeassistant api
                    ws.send(JSON.stringify({
                        id: 2,
                        type: "subscribe_events",
                        event_type: "state_changed"
                    }));
                } else if (data["type"] == "event") {
                    // Handle all events sent from the websocket api
                    var e = data["event"];
                    this.handleWsEvent(e);
                } else if (data["type"] == "result" && data["success"]) {
                    //Handle fetch results
                    var result = data["result"];
                    if (result) {
                        this.handleWsResults(result);
                    }
                }
            }.bind(this);

            ws.onclose = function () {
                this.connectWebsocket();
            }.bind(this);
        }

        // Handles all responses to messages sent over ws to homeassistant

    }, {
        key: "handleWsResults",
        value: function handleWsResults(result) {
            // First we need to loop through all the entities that
            // the homeassistant returns, and then find the entities that we want
            for (var i = 0; i < result.length; i++) {
                var entity = result[i];
                var attributes = entity["attributes"];
                if (entity["entity_id"] == this.state.climate_id) {
                    // This is the entity I want at least
                    var current = attributes["current_temperature"];
                    var target = attributes["temperature"];
                    this.setState({
                        current: current,
                        target: target
                    });
                }
            }
        }

        // Handles all event updates from homeassistant ws api

    }, {
        key: "handleWsEvent",
        value: function handleWsEvent(event) {
            if (event["data"]["entity_id"] == this.state.climate_id) {
                var attributes = event["data"]["new_state"]["attributes"];
                var current = attributes["current_temperature"];
                var target = attributes["temperature"];
                this.setState({
                    current: current,
                    target: target
                });
            }
        }
    }, {
        key: "handleTempChange",
        value: function handleTempChange(direction) {
            var value;
            if (direction == "up") {
                value = 0.5;
            } else if (direction == "down") {
                value = -0.5;
            }
            var currentTemp = this.state.target;
            var newTemp = Math.round((currentTemp + value) * 2) / 2;
            this.setState({
                target: newTemp
            });

            this.updateTemperature(newTemp);
        }
    }, {
        key: "updateTemperature",
        value: function updateTemperature(temp) {
            if (this.state.ws) {
                var id = this.state.currentId;
                this.state.ws.send(JSON.stringify({
                    id: id,
                    type: "call_service",
                    domain: "climate",
                    service: "set_temperature",
                    // Optional
                    service_data: {
                        entity_id: this.state.climate_id,
                        temperature: temp
                    }
                }));

                this.setState({
                    currentId: id + 1
                });
            }
        }
    }]);

    return Thermostat;
}(React.Component);

ReactDOM.render(React.createElement(Thermostat, { target: "22", current: "21" }), document.getElementById("root"));