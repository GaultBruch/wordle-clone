import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

class Board extends React.Component {
    //Board is passed props = {textlist} /* Might also want to pass it the word given to check completion, not sure yet. */
    constructor(props) {
        super(props);
        this.state = {
            squares: Array(30).fill(null),
            squaresStyles: Array(30).fill({backgroundColor: 'rgb(49, 49, 49)'}),
            wordCounter: 0,
            counter: 0,
            gameOver: false, //No check is currently being done for this.
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.checkWord = this.checkWord.bind(this);
        this.checkList = this.checkList.bind(this);
        this.handleStyleAdd = this.handleStyleAdd.bind(this);
        this.handleCheckWin = this.handleStyleAdd.bind(this);
    }

    checkWin(array) {
        /*DOCSTRING: Takes in an array of correct, inword, wrong, if all values are correct then the player has won.
        This should be passed up to the gamestate. Also, if the board has filled up (checked via counter) and the 
        the state is not all correct then we can send a 'lost' string back instead.
        Input: Array[5]
        Output: 0, 1 ,2 for playing, won, lost */
        let statusCode = 0;
        console.log(this.state.counter);
        console.log(array);
        console.log('array2 inlcudes '+ array.includes("wrong"));
        if (array.includes('wrong')===true || array.includes('inWord')) {
            console.log(this.props.counter);
            if (this.state.counter >= 30) {statusCode = 2;}
            if (this.state.counter < 30) {statusCode = 0;}
        } else {
            statusCode = 1;
        }
        this.props.changeStatusCode(statusCode);
    }

    componentWillReceiveProps(nextProps) {
        console.log('Component Did Update Call');
        console.log('nextProps' + nextProps.gameState);
        if (nextProps.gameState === 3) {
            console.log('this.state.squares '+ this.state.squares);
            this.setState({
                wordCounter: 0,
                counter: 0,
                squares: Array(30).fill(null),
                squaresStyles: Array(30).fill({backgroundColor: 'rgb(49, 49, 49)'}),
            });
        }
    }

    checkList() {
        /* DOCSTRING: This function takes in a potential word from the board and outputs a true or false value based on whether or not that word is in the wordlist.
        The intention of this function is to provide a check for submitted words, and only allow words to be submitted if they are actually a word given in the wordlist.
        Input: (word) string, in this case sliced based on the squares state, not brought in from parameters. 
        Output: Boolean True or False === word in wordList

        Potential Improvement. Pseudo-hashmapping of the wordlist could improve searchability, as this loops currently over the entire wordlist, and is slow.
        */

        let wordSlice = this.state.squares.slice(this.state.counter-5,this.state.counter);
        let wordSliceString = wordSlice.join('');
        console.log(wordSliceString);
        console.log('checkList wordSlice'+wordSlice);
        console.log('Checking List for word');
        console.log(this.props.textList);
        for (var i = 0 ; i < this.props.textList.length ; i++) {
            if (this.props.textList[i] === wordSliceString) {
                console.log(wordSliceString);
                console.log('This is a valid word in the wordlist');
                return true;
            }
        }
        console.log('this is not a valid word');
        return false;
    }

    checkWord(wordAnswer) {
        /* DOCSTRING: This function is provided the correctword from the game state, and checks the last submitted line from the player to see which letters match up. Returns an array
        with information about the state of letters through correct, incorrect, wrong location strings. Correct letters are in the correct place from the user guess, wrong location are
        in the game word, but in the wrong order, and incorrect letters are not in the word at all.
        Input: Answer Word
        Output: Array[5] with correct, in word, wrong strings for each letter in the player guess
        */

        let correct = {backgroundColor:  'green'};
        let inWord = {backgroundColor: 'darkblue'};
        let wrong = {backgroundColor: 'rgb(49, 49, 49)'}

        console.log(wordAnswer);
        let wordSlice = this.state.squares.slice(this.state.counter-5,this.state.counter);
        let wordSliceCopy = wordSlice.slice(); //Make a secondary copy to ensure pop doesn't screw iteration
        let guessArray = wordAnswer.split('');
        console.log('guessArray= ' + guessArray);
        let checkArray = [null,null,null,null,null];
        let checkArray2 = [null,null,null,null,null];
        console.log(wordSlice);
        //edit squares by adding id value and pass in correct, in word, wrong in.

        for (let i = 0; i < guessArray.length; i++) {
            if (wordAnswer.includes(wordSlice[i])) {
                console.log(wordSlice[i] + ' was part of the word!');
                checkArray[i] = inWord;
                checkArray2[i] = 'inWord';
            } else {
                checkArray[i] = wrong;
                checkArray2[i] = 'wrong';
            }
        }
        
        //We've checked each letter to see that it is in the word, but we should also check whether or not it is in the right location if it is we'll overwrite the 'in word'
        for (let i = 0; i < guessArray.length; i++) {
            if (wordSliceCopy[i] === guessArray[i]) {
                checkArray[i] = correct;
                checkArray2[i] = 'correct';
            }
        }
        console.log('Final Checkarray ' + checkArray);
        return [checkArray, checkArray2];
    }

    handleStyleAdd(styleArray) {
        /*DOCSTRING: Takes in the styling array from checkWord and inputs it into setState styling for squares based on the state.counter variable. Entirely a handler function */
        let tempStyling = this.state.squaresStyles.slice();
        Array.prototype.splice.apply(tempStyling, [this.state.counter-5, this.state.counter].concat(styleArray));
        this.setState(() => ({
            squaresStyles: tempStyling,
        }));
    }

    handleKeyPress(e) {
        //Check if game is still being played with gameWon if it is accept input
        if (this.props.gameState === 0) {

            // Deals with backspace key, only goes up to the last line
            if (e.which===8 && this.state.wordCounter > 0) {
                console.log(this.props.word);
                const newSquares = this.state.squares.slice();
                newSquares[this.state.counter-1] = null;
                this.setState(()=> ({
                    counter: this.state.counter -1,
                    wordCounter: this.state.wordCounter -1,
                    squares: newSquares, 
                }));
            }

            //Deals with the enter key. Checks if word is in wordlist, should also check letter styling by calling checkfunction
            if (e.which===13 && this.state.counter%5 ===0 && this.state.counter < 31) {
                console.log('This props word'+this.props.word);
                if (this.checkList() === true) {
                    let checkArray = this.checkWord(this.props.word);
                    this.handleStyleAdd(checkArray[0]);
                    this.checkWin(checkArray[1]);
                    this.setState(() => ({
                        wordCounter: 0,
                        counter: this.state.counter + 0,
                    }));
                    console.log("counter " + this.state.counter);
                
                } else {
                    //Render warning, not a valid word
                }

            } else if (((e.which >= 65 && e.which <= 90) || (e.which >= 97 && e.which <=122))  && this.state.counter < 30 && this.state.wordCounter <5) {
                const newSquares = this.state.squares.slice();
                newSquares[this.state.counter] = e.key.toLowerCase();
                
                this.setState((state) => ({
                    wordCounter: state.wordCounter + 1,
                    counter: state.counter + 1,
                    squares: newSquares,
                }));
                console.log(this.state.squares);
                
                console.log('Keypressed: ' + e.key)
            } else {
                console.log('Keypressed is not a known key: ' + e.which);
            }
        }
    }

    renderSquare(i) {
        return <Square value={this.state.squares[i]} style={this.state.squaresStyles[i]}/>;
    }

    render() {
        return (
            <div onKeyDown={this.handleKeyPress} className='board-grid' tabIndex={0}>
                <div className='board-row'>
                    {this.renderSquare(0, 0)}
                    {this.renderSquare(1, 1)}
                    {this.renderSquare(2, 2)}
                    {this.renderSquare(3, 3)}
                    {this.renderSquare(4, 4)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(5, 5)}
                    {this.renderSquare(6, 6)}
                    {this.renderSquare(7, 7)}
                    {this.renderSquare(8, 8)}
                    {this.renderSquare(9, 9)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(10, 10)}
                    {this.renderSquare(11, 11)}
                    {this.renderSquare(12, 12)}
                    {this.renderSquare(13, 13)}
                    {this.renderSquare(14, 14)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(15, 15)}
                    {this.renderSquare(16, 16)}
                    {this.renderSquare(17, 17)}
                    {this.renderSquare(18, 18)}
                    {this.renderSquare(19, 19)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(20, 20)}
                    {this.renderSquare(21, 21)}
                    {this.renderSquare(22, 22)}
                    {this.renderSquare(23, 23)}
                    {this.renderSquare(24, 24)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(25, 25)}
                    {this.renderSquare(26, 26)}
                    {this.renderSquare(27, 27)}
                    {this.renderSquare(28, 28)}
                    {this.renderSquare(29, 29)}
                </div>
            </div>
        );
    }
}

class Square extends React.Component {
    render() {
        return (
            <div className={"square"} style={this.props.style}>
                {this.props.value}
            </div>
        );
    }
}

function getTextFromFile(url) { //Fetch function used to get text from combined wordlist
    return fetch(url).then(function(response) {
        return response.text();
    }).then(function(text) {
        return text;
    });
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {guessNumber: 0, word: 'green', list: [], gameState: 0};
        this.getRandomWord = this.getRandomWord.bind(this);
        this.handler = this.handler.bind(this);
        this.checkWin = this.checkWin.bind(this);
        this.resetGameState = this.resetGameState.bind(this);
        this.changeStatusCode = this.changeStatusCode.bind(this);
        /*
        this.doIt = this.doIt.bind(this);
        this.doFirst = this.doFirst.bind(this);
        this.doSecond = this.doSecond.bind(this); */
    }

    handler(e) {
        this.getRandomWord(e.target.value);
        console.log(this.state);
    }

    changeStatusCode(status) {
        //StatusCodeChange passed to board so that I can use the counter, and then pass the returned status to this function
        this.setState({gameState: status,})
    }

    checkWin(array) {
        /*DOCSTRING: Takes in an array of correct, inword, wrong, if all values are correct then the player has won.
        This should be passed up to the gamestate. Also, if the board has filled up (checked via counter) and the 
        the state is not all correct then we can send a 'lost' string back instead.
        Input: Array[5]
        Output: 0, 1 ,2 for playing, won, lost */
        let statusCode = 0;
        console.log(this.state.counter);
        console.log(array);
        console.log('array2 inlcudes '+ array.includes("wrong"));
        if (array.includes('wrong')===true || array.includes('inWord')) {
            console.log(this.props.counter);
            if (this.state.counter >= 30) {statusCode = 2;}
            if (this.state.counter < 30) {statusCode = 0;}
        } else {
            statusCode = 1;
        }
        return statusCode;
    }

    componentDidMount() {
        getTextFromFile('combined_wordlist.txt').then(res => {
            let textList = res.split("\n");
            this.setState({
                word: textList[Math.floor(Math.random() *textList.length)],
                list: textList,
            
        })
        console.log('this.state.word1 ' + this.state.word);
        });
    }

    getRandomWord() {
        getTextFromFile('combined_wordlist.txt').then(res => {
            let textList = res.split("\n");
            this.setState({
                word: textList[Math.floor(Math.random() *textList.length)],
                list: textList,
            
        })
        console.log('this.state.word1 ' + this.state.word);
        });
    }

    /* Trying to work with callback functions here, going to have to likely watch a video on them though
    cause this seems scuffed 

    doIt() {
        this.doFirst();
    }

    doFirst() {
        this.setState({gameState: 3,},()=>{
            this.doSecond()
        });
    }

    doSecond() {
        this.setState({gameState: 0,})
        this.getRandomWord();
    } */

    resetGameState() {
        this.setState({gameState: 3,},() => {
            this.setState({gameState: 0,});
            this.getRandomWord();
        });
        /*
        this.setState({
            gameState: 3,
        },this.setState({
            gameState: 0,
        }));
        this.getRandomWord(); */
    }

    render() {
        let gameStatus = '';
        if (this.state.gameState === 2) {
            gameStatus = 
            <>
                <p>Lost this time, the word was {this.state.word}</p>
                <button onClick={this.resetGameState}>Try new word</button>;
            </>
        }

        if (this.state.gameState === 1) {
            gameStatus = 
            <>
                <p>Nice win!</p>;
                <button onClick={this.resetGameState}>Try new word</button>
            </>
        }

        if (this.state.gameState === 0) {
            gameStatus = <p></p>;
        }

        return (
            <div className='game'>
                
                <div className='game-board'>
                    
                    <button onClick={this.resetGameState}>
                    Get new word?
                    </button>
                    {/*<WordPicker getRandomWord={this.getRandomWord} word={this.state.word}/>*/}
                    <Board textList = {this.state.list} word={this.state.word} gameState={this.state.gameState} changeStatusCode={this.changeStatusCode}/>
                    {gameStatus}
                    <p>{this.state.gameState}</p>
                </div>
            </div>
        )
    }
}

function renderer() {
    root.render(<Game />);
}

renderer();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();