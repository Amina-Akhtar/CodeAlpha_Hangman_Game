from flask import Flask, jsonify, request, render_template
import random
app = Flask(__name__)
words = ["python", "java", "kotlin", "javascript", "csharp"]
selected_word = ""
remaining_attempts = 6

def get_random_word():
    return random.choice(words)

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/initialize", methods=["GET"])
def initialize():
    global selected_word, remaining_attempts
    selected_word = get_random_word()
    remaining_attempts = 6  
    return jsonify({"word": selected_word, "remaining_attempts": remaining_attempts})  
@app.route("/guess", methods=["POST"])
def guess():
    global remaining_attempts
    data = request.json
    guessed_letter = data.get("letter")
    word = data.get("word")
    if not guessed_letter or not word:
        return jsonify({"error": "Invalid request"}), 400
    if guessed_letter not in selected_word:
        remaining_attempts -= 1 

    return jsonify({"success": True, "letter": guessed_letter, "remaining_attempts": remaining_attempts})

if __name__ == "__main__":
    app.run(debug=True)
