from flask import Flask, render_template, request, redirect, url_for
import json

app = Flask("Thermostat")

config_dir = "static/config.json"

def get_config():

    global config_dir

    config = {

    }

    with open(config_dir, "r") as f:
        obj = json.loads(f.read())
        config = obj

    return config

@app.route('/')
def thermostat_control():
    context = {
        "config": get_config(),
    }
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
    global config_dir

    form_data = request.form

    new_config = {}

    with open(config_dir, "r+") as f:
        config_data = json.loads(f.read())
        for category in config_data:
            new_config[category] = form_data[category]
        f.seek(0)
        json.dump(new_config, f)


    return redirect(url_for('config'))



if __name__ == "__main__":
    app.run()
