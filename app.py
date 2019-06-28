from flask import Flask, render_template, request, redirect, url_for
import json

app = Flask("Thermostat")

config_file = "static/config.json"

def get_config():

    global config_file

    config = {

    }
    try:
        with open(config_file, "r") as f:
            obj = json.loads(f.read())
            config = obj

        return config
    except Exception as e:
        default_config = {
                "hass_url": "",
                "ssl_enabled": "",
                "hass_password": "",
                "client_id": "",
                "tooken": "",
            }
        with open(config_file, "w+") as f:

            f.write(json.dumps(default_config))
        return default_config

@app.route('/')
def thermostat_control():
    context = {
        "config": get_config(),
    }

    if context["config"]["hass_url"] == "":
        # config not ok
        return redirect("/config")


    return render_template("index.html", context=context)

@app.route('/config')
def config():
    context = {
        "config": get_config(),
    }


    return render_template("config.html", context=context)

@app.route('/set_config', methods=['POST'])
def set_config():
    """Handle edits done to the config via frontend tool"""
    global config_file

    form_data = request.form

    new_config = {}

    with open(config_file, "r+") as f:
        config_data = json.loads(f.read())
        for category in config_data:
            new_config[category] = form_data[category]
        f.seek(0)
        json.dump(new_config, f)


    return redirect(url_for('config'))



if __name__ == "__main__":
    app.run()
