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
            wordCounter: 0,
            counter: 0,
            gameOver: false, //No check is currently being done for this.
        };
        this.handleKeyPress = this.handleKeyPress.bind(this);
        this.checkWord = this.checkWord.bind(this);
        this.checkList = this.checkList.bind(this);
    }

    checkList() {
        /* DOCSTRING: This function takes in a potential word from the board and outputs a true or false value based on whether or not that word is in the wordlist.
        The intention of this function is to provide a check for submitted words, and only allow words to be submitted if they are actually a word given in the wordlist.
        Input: (word) string, in this case sliced based on the squares state, not brought in from parameters. 
        Ouput: Boolean True or False === word in wordList

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
        Output: Array[5] with Correct, in word, wrong strings for each letter in the player guess
        */
        console.log(wordAnswer);
        let wordSlice = this.state.squares.slice(this.state.counter-5,this.state.counter);
        let wordSliceCopy = wordSlice.slice(); //Make a secondary copy to ensure pop doesn't screw iteration
        let guessArray = wordAnswer.split('');
        console.log('guessArray= ' + guessArray);
        let checkArray = [null,null,null,null,null];
        console.log(wordSlice);
        //edit squares by adding id value and pass in exact, right, wrong in.

        for (let i = 0; i < guessArray.length; i++) {
            if (wordAnswer.includes(wordSlice[i])) {
                console.log(wordSlice[i] + ' was part of the word!');
                checkArray[i] = 'in word';
            } else {
                checkArray[i] = 'wrong';
            }
        }
        
        //We've checked each letter to see that it is in the word, but we should also check whether or not it is in the right location if it is we'll overwrite the 'in word' 

        for (let i = 0; i < guessArray.length; i++) {
            if (wordSliceCopy[i]=== guessArray[i]) {
                checkArray[i] = 'correct';
            }
        }
        console.log('Final Checkarray ' + checkArray);
        return checkArray;
    }

    handleKeyPress(e) {
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
        if (e.which===13 && this.state.counter%5 ===0 && this.state.counter < 30) {
            console.log('This props word'+this.props.word);
            if (this.checkList() === true) {
                this.checkWord(this.props.word);
                this.setState(() => ({
                    wordCounter: 0,
                    counter: this.state.counter +0,
                }));
            
            } else {
                //Render warning, not a valid word
            }

        } else if (((e.which >= 65 && e.which <= 90) || (e.which >= 97 && e.which <=122))  && this.state.counter < 30 && this.state.wordCounter <5) {
            const newSquares = this.state.squares.slice();
            newSquares[this.state.counter] = e.key;
            
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

    renderSquare(i, row, column) {
        return <Square value={this.state.squares[i]} rowValue={row} columnValue={column}/>;
    }

    render() {
        return (
            <div onKeyDown={this.handleKeyPress} className='board-grid' tabIndex={0}>
                <div className='board-row'>
                    {this.renderSquare(0, 0, 0)}
                    {this.renderSquare(1, 0, 1)}
                    {this.renderSquare(2, 0, 2)}
                    {this.renderSquare(3, 0, 3)}
                    {this.renderSquare(4, 0, 4)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(5, 1, 0)}
                    {this.renderSquare(6, 1, 1)}
                    {this.renderSquare(7, 1, 2)}
                    {this.renderSquare(8, 1, 3)}
                    {this.renderSquare(9, 1, 4)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(10, 2, 0)}
                    {this.renderSquare(11, 2, 1)}
                    {this.renderSquare(12, 2, 2)}
                    {this.renderSquare(13, 2, 3)}
                    {this.renderSquare(14, 2, 4)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(15, 3, 0)}
                    {this.renderSquare(16, 3, 1)}
                    {this.renderSquare(17, 3, 2)}
                    {this.renderSquare(18, 3, 3)}
                    {this.renderSquare(19, 3, 4)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(20, 4, 0)}
                    {this.renderSquare(21, 4, 1)}
                    {this.renderSquare(22, 4, 2)}
                    {this.renderSquare(23, 4, 3)}
                    {this.renderSquare(24, 4, 4)}
                </div>
                <div className='board-row'>
                    {this.renderSquare(25, 5, 0)}
                    {this.renderSquare(26, 5, 1)}
                    {this.renderSquare(27, 5, 2)}
                    {this.renderSquare(28, 5, 3)}
                    {this.renderSquare(29, 5, 4)}
                </div>
            </div>
        );
    }
}

class Square extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className={"square"}>
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

/*
class WordPicker extends React.Component {
    constructor(props) {
        super(props);
        this.handler = this.handler.bind(this);
    }

    handler(e) {
        this.props.getRandomWord(e.target.value);
    }

    render() {
        return (
            <>
            <button onClick={this.handler}>
                Get new word?
            </button>
            <p>Your Word is: {this.props.word}</p>
            </>
        );
        
    }
} */


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {guessNumber: 0, word: 'green', list: []};
        this.getRandomWord = this.getRandomWord.bind(this);
        this.handler = this.handler.bind(this);
    }

    handler(e) {
        this.getRandomWord(e.target.value);
        console.log(this.state);
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



    render() {
        return (
            <div className='game'>
                <div className='game-board'>
                    <button onClick={this.handler}>
                    Get new word?
                    </button>
                    <p>Your Word is: {this.state.word}</p>
                    {/*<WordPicker getRandomWord={this.getRandomWord} word={this.state.word}/>*/}
                    <Board textList = {this.state.list} word={this.state.word}/>
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
