import React, {useState} from "react";
import RandomWords from "random-words";
import InputGroup from "react-bootstrap/InputGroup";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Collapse from "react-bootstrap/Collapse";
import "./index.css";
import confetti from "canvas-confetti";

function App() {
  const [openDebug, setOpenDebug] = useState(false);
  {
    /*Param our game.*/
  }
  const [displayAnswer, setDisplayAnswer] = useState(false);
  const [totalGuesses, settotalGuesses] = useState(10);
  const [originalWord, setOriginalWord] = useState(RandomWords());
  const [currentWord, setCurrentWord] = useState(
    originalWord.replace(/./g, " - ")
  );
  const [usedGuesses, setUsedGuesses] = useState([]);
  const [guess, setGuess] = useState("");
  const [validationMessage, setValidationMessage] = useState("");
  const [numberOfGuesses, setNumberOfGuesses] = useState(0);


  function startGame() {
    {
      /*Start the game by generating a new word, set the current word to all dashes, reset guesses, and the number of guesses */
    }
    setOriginalWord(RandomWords());
    setCurrentWord(originalWord.replace(/./g, " - "));
    setUsedGuesses([]);
    setGuess("");
    setNumberOfGuesses(0);
    setValidationMessage("");
  }
  function handleDisplayAnswer() {
    {/* Toggle of the answer */}
    setDisplayAnswer(!displayAnswer);
  }

  function handleChangeNumberGuesses(number) {
     {/* If the number of guesses changes then reset everything */}
    settotalGuesses(number);
    setNumberOfGuesses(0);
  }
  function generateGuessedLetters(){
     {/* Loop through our guesses and return a nice looking stylized piece */}
    return usedGuesses.map(function(letter, i) {
      return <span key={i} className="text-center guessedLetter">{letter}</span>;
    }); 
  }
  function getPercentageOfGuesses(){
     {/* Calculate the percentage and return a class that corresponds with it*/}
    let percentageMath = ((totalGuesses - numberOfGuesses)/totalGuesses) * 100;
  
    if(percentageMath > 75){
      return 'turnsNormal';
    }else if(percentageMath > 50){
      return 'turnsHigh';
    }else if(percentageMath > 25){
      return 'turnsMedium';
    }else{
      return 'turnsLow';
    }

  }
  function guessLetter(userGuess) {
     {/* Main guess function */}
    userGuess = userGuess.toLowerCase();
    {
      /*Make sure only alphabetical characters are used. If not return an error */
    }
    if (userGuess.search(/[^a-zA-Z]+/) !== -1) {
      setValidationMessage(`Please enter only alphabetical letters.`);
      return;
    }
    {
      /*Make sure only the guess hasn't been used already. If not return an error */
    }
    if (usedGuesses.indexOf(userGuess) > -1) {
      setValidationMessage(`You have already used the letter ${userGuess}.`);
      return;
    }

    {
      /* User has passed validation, continue on*/
    }
    let tmpGuesses = [...usedGuesses, userGuess];
    setUsedGuesses([...usedGuesses, userGuess]);

    let wordStatus = [];
    let splitWord = originalWord.split("");
    let foundLetter = false;
     {/* Split the word into an array, loop over it and see if the guessed letter matches a letter in split*/}

    if (splitWord.indexOf(userGuess) >= 0) {
      foundLetter = true;
      {
        /* Launch confetti from the left edge*/
      }
      confetti({
        particleCount: 7,
        angle: 60,
        spread: 55,
        origin: {x: 0},
      });
      {
        /* and launch confetti from the right edge*/
      }
      confetti({
        particleCount: 7,
        angle: 120,
        spread: 55,
        origin: {x: 1},
      });
    }
    {
      /* After splitting our original word to an array we loop over it to see if the guessed letter is found */
    }
    splitWord.forEach((letter) => {
      if (tmpGuesses.indexOf(letter) >= 0) {
        {
          /* Letter was found, push it to the list */
        }
        wordStatus.push(letter);
      } else {
        {
          /* Letter was not found, push - to the list */
        }
        wordStatus.push("-");
      }
    });
    if (!foundLetter) {
      setNumberOfGuesses(numberOfGuesses + 1);
    }
    setCurrentWord(wordStatus.join(""));
    setGuess("");
  }
  return (
    <>
      <Container>
        <Row>
          <Col className="text-center">
            <h1>Hangman</h1>
          </Col>
        </Row>
        <Row>
          <Col  md={{ span: 3}}  className="text-center"> 
            <h4>Letters Guessed:</h4>
            <Row id="guessArea">{generateGuessedLetters()}</Row>
          </Col>
          <Col  md={{ span: 3, offset: 3 }} className="text-center">
            <h4>Turns Remaining:</h4> <div id="turnsRemaining" className={getPercentageOfGuesses()}>{totalGuesses - numberOfGuesses}</div>
          </Col>
        </Row>
        <Row>
          <Col className="text-center" id="wordToGuess">
            <h2>{currentWord}</h2>
          </Col>
        </Row>
        <Row>
          <Col>
            <InputGroup className="mb-3">
              <InputGroup.Prepend>
                <Button onClick={startGame}>Generate New Word</Button>
              </InputGroup.Prepend>
              <FormControl
                aria-describedby="basic-addon1"
                placeholder="Guess A Letter"
                value={guess}
                onChange={(e) => guessLetter(e.target.value)}
                disabled={
                  numberOfGuesses >= totalGuesses ||
                  currentWord === originalWord
                }
              />
            </InputGroup>
            {validationMessage.length === 0 && <p>{validationMessage}</p>}
          </Col>
        </Row>
        <Row>
          <Col className="text-center">
            
              {currentWord === originalWord && (
                <p className="animated tada"><h1>You Win!</h1>
                <br/>
                <p> <Button onClick={startGame} variant="success">Play Again</Button></p>
                </p>
              )}
              {numberOfGuesses >= totalGuesses && <p><h1>Game Over</h1><br/>
              <p>The word was <strong className="text-warning">{originalWord}</strong></p>
              <p> <Button onClick={startGame} variant="success">Play Again</Button></p>
               </p>}
            
          </Col>
        </Row>
        <hr />

        <div className="text-center">
          <Button
            onClick={() => setOpenDebug(!openDebug)}
            aria-controls="example-collapse-text"
            aria-expanded={openDebug}
            variant="warning">
            {!openDebug ? "Open" : "Close"} Debug
          </Button>
        </div>
        <Collapse in={openDebug}>
          <Row>
            <Col lg={6}>
              <Form.Group controlId="totalGuesses">
                <Form.Label>Change Total Guesses</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  max="26"
                  value={totalGuesses}
                  onChange={(e) => handleChangeNumberGuesses(e.target.value)}
                />
              </Form.Group>
            </Col>
            <Col lg={6}>
              <label htmlFor="displayAnswer">&nbsp;</label>
              <br />
              <Button
                variant="secondary"
                onClick={handleDisplayAnswer}
                id="displayAnswer">
                {displayAnswer ? "Display Answer" : "Hide answer"}
              </Button>
              <h4>{displayAnswer === true && originalWord}</h4>
            </Col>
          </Row>
        </Collapse>
      </Container>
    </>
  );
}

export default App;
