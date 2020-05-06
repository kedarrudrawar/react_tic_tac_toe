import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Board from './Board.js';


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
            winningSquares: [],
            draw: false,
        }
    }

    checkDraw(squares) {
        for(let s of squares){
            if (! s){
                this.setState({
                    draw: false
                });
                return;
            }
        }
        this.setState({
            draw: true
        });
    }

    calculateWinner(squares) {
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
                this.setState({
                    winningSquares: lines[i],
                });
                return squares[a];
            }
        }
        // set empty list for no winner post jump
        this.setState({
            winningSquares: [],
        });
        return null;
    }

    handleClick(i){
        let history, current;

        history = this.state.history.slice(0, this.state.stepNumber + 1);
        current = history[this.state.stepNumber];

        const squares = current.squares.slice();
        if (this.state.winningSquares.length > 0 || squares[i]){
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';

        let nextHistory = {squares: squares};
        history = history.concat([nextHistory]);

        this.setState({
            history: history,
            stepNumber: this.state.stepNumber + 1,
            xIsNext: !this.state.xIsNext,
        });

        this.checkDraw(squares);
        this.calculateWinner(squares);
    }

    historyToMoves = () => {
        let history = this.state.history;

        let moves = history.map((step, move) => {
            let previous = null;
            if (move > 0) previous = history[move - 1];

            // find which position was changed to record coordinate
            let alteredPosition = previous ? this.findDifference(previous, history[move]) : 0;
            let row = Math.floor(alteredPosition / 3);
            let col = alteredPosition % 3;

            let desc = move ?
                'Go to move #' + move + ' - (' + row + ',' + col + ')' :
                'Go to game start';

            // bold the current state
            let button = move === this.state.stepNumber ?
                <button onClick={() => this.jumpTo(move)}><b>{desc}</b></button> :
                <button onClick={() => this.jumpTo(move)}> {desc} </button>;

            return (
                <li key={move}>
                    {button}
                </li>
            )
        });

        if (! this.state.ascendingMoves)
            moves = moves.reverse();

        return moves;

    };

    jumpTo(step){
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });

        let squares = this.state.history[step].squares;
        this.calculateWinner(squares);
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
        const winner = this.state.winningSquares;
        const moves = this.historyToMoves();
        const draw = this.state.draw;

        let status;

        if (winner.length > 0) {
            status = 'Winner: ' + current.squares[winner[0]];
        } else if (draw){
            status = 'Draw!';
        } else {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        let order = this.state.ascendingMoves ? 'ascending' : 'descending';
        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        winningSquares={this.state.winningSquares}
                        squares={current.squares}
                        onClick={(i) =>  this.handleClick(i)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <button onClick={() => {
                        this.setState({
                            ascendingMoves: !this.state.ascendingMoves,
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



