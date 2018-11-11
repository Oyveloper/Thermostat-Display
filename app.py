from flask import Flask, render_template

app = Flask("Thermostat")

@app.route('/')
def thermostat_control():
    return render_template("index.html")


if __name__ == "__main__":
    app.run(host="192.168.86.201")
