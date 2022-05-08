import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));

class Board extends React.Component {
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
    }

    checkWord(word) {
        let wordSlice = this.state.squares.slice(this.state.counter-5,this.state.counter)
        //wordSlice = wordSlice.join('');
        console.log(wordSlice);
        //edit squares by adding id value and pass in exact, right, wrong in.
        for (const letter in word) {
            if (wordSlice.includes(letter)) {
                wordSlice.pop(letter);
                console.log({letter} + " was part of the word!");
            }

        }
            

    }

    handleKeyPress(e) {
        if (e.which===13 && this.state.counter%5 ===0 && this.state.counter < 30) {
            console.log("Try Guess, note this doesn't check for whether the word is in the list yet.");
            //this.checkWord(this.props.word)
            this.setState(() => ({
                wordCounter: 0,
            }));
            
        } else if (((e.which >= 65 && e.which <= 90) || (e.which >= 97 && e.which <=122))  && this.state.counter < 30 && this.state.wordCounter <5) {
            const newSquares = this.state.squares.slice();
            newSquares[this.state.counter] = e.key;
            
            this.setState((state) => ({
                wordCounter: state.wordCounter + 1,
                counter: state.counter + 1,
                squares: newSquares,
            }));
            console.log(this.state.squares);
            
            console.log('Keypressed ' + e.key)
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
}


class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {guessNumber: 0, word: ''};
        this.getRandomWord = this.getRandomWord.bind(this);
        
    }

    getRandomWord() {
        getTextFromFile('combined_wordlist.txt').then(res => {
            let textList = res.split("\n");
            this.setState( {word: textList[Math.floor(Math.random() *textList.length)]}) 
        });
    }

    render() {
        return (
            <div className='game'>
                <div className='game-board'>
                    <WordPicker getRandomWord={this.getRandomWord} word={this.state.word}/>
                    <Board />
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
