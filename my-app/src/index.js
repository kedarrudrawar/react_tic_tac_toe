import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
    return (
        <button
            className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );

}

class Board extends React.Component {
    renderSquare(i) {
        return (
            <Square
                value={this.props.squares[i]}
                onClick={() => this.props.onClick(i)}
            />
        );
    }

    render() {
        return (
            <div>
                <div className="board-row">
                    {this.renderSquare(0)}
                    {this.renderSquare(1)}
                    {this.renderSquare(2)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3)}
                    {this.renderSquare(4)}
                    {this.renderSquare(5)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6)}
                    {this.renderSquare(7)}
                    {this.renderSquare(8)}
                </div>
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            stepNumber: 0,
            xIsNext: true,
            ascendingMoves: true,
        }
    }

    handleClick(i){
        console.log(i);
        let ascending = this.state.ascendingMoves;
        let history, current;

        if (ascending) {
            history = this.state.history.slice(0, this.state.stepNumber + 1);
            current = history[this.state.stepNumber];
        }
        else{
            history = this.state.history.slice(this.state.stepNumber, this.state.history.length);
            current = history[0]
        }

        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i] ) {
            return;
        }

        // console.log(squares[i]);
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        // console.log(squares[i]);

        console.log('history before move');
        console.log(history);

        let nextHistory = {squares: squares};
        if (this.state.ascendingMoves){
            history = history.concat([nextHistory]);
        }
        else{
            history = [nextHistory].concat(history);
        }


        let nextStep = this.state.ascendingMoves ? this.state.stepNumber + 1 : 0;
        console.log('new history after move:');
        console.log(history);
        this.setState({
            history: history,
            stepNumber: nextStep,
            xIsNext: !this.state.xIsNext,
        });
    }

    historyToMoves = () => {
        let history = this.state.history;
        let ascending = this.state.ascendingMoves;
        let l = history.length;

        return history.map((step, move) => {
            let actualMoveIdx = ascending ? move : l - move - 1;
            let previous = null;
            if (ascending){
                if (move > 0) previous = history[move - 1];
            }
            else{
                if (move < l - 1) previous = history[move + 1];
            }

            // console.log(previous);


            let alteredPosition = previous ? this.findDifference(previous, history[move]) : 0;
            let row = Math.floor(alteredPosition / 3);
            let col = alteredPosition % 3;

            let desc = actualMoveIdx ?
                'Go to move #' + actualMoveIdx + ' - (' + row + ',' + col + ')' :
                'Go to game start';

            // bold the current state
            let button = move === this.state.stepNumber ?
                <button onClick={() => this.jumpTo(actualMoveIdx)}><b>{desc}</b></button> :
                <button onClick={() => this.jumpTo(actualMoveIdx)}> {desc} </button>;

            return (
                <li key={move}>
                    {button}
                </li>
            )
        });
    };

    jumpTo(step){
        let l = this.state.history.length;
        step = this.state.ascendingMoves ? step : l - step - 1;
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    findDifference(previous, current){
        for(let i = 0; i < current.squares.length; i++){
            if (!previous.squares[i] && current.squares[i]){
                return i;
            }
        }
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const moves = this.historyToMoves();

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        let order = this.state.ascendingMoves ? 'ascending' : 'descending';
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={(i) =>  this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => {
                        this.setState({
                            ascendingMoves: !this.state.ascendingMoves,
                            history: this.state.history.reverse(),
                            stepNumber: this.state.history.length - (this.state.stepNumber + 1),
                        })
                    }}>
                        {order}
                    </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];

    for (let i = 0; i < lines.length; i++){
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]){
            return squares[a];
        }
    }
    return null;
}

