import React from 'react';
import ReactDOM from 'react-dom';
import './index.css'

function Square(props) {
    let defaultStyle = {
        background: '#fff',
        border: '1px solid #999',
        float: 'left',
        fontSize: '24px',
        fontWeight: 'bold',
        lineHeight: '34px',
        height: '34px',
        marginRight: '-1px',
        marginTop: '-1px',
        padding: 0,
        textAlign: 'center',
        width: '34px',
        outline: 'none',
    };

    let winningStyle = props.winningSquares.includes(props.i) ? {backgroundColor:'lightblue'} : {};
    let combined = Object.assign({}, defaultStyle, winningStyle);

    return (
        <button
            style={combined}
            // className="square"
            onClick={props.onClick}
        >
            {props.value}
        </button>
    );

}

class Board extends React.Component {
    constructor(props){
        super(props);
    }

    renderSquare(i) {
        return (
            <Square
                winningSquares={this.props.winningSquares}
                i={i}
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
            winningSquares: [],
        }
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
        return null;
    }

    handleClick(i){
        let history, current;

        history = this.state.history.slice(0, this.state.stepNumber + 1);
        current = history[this.state.stepNumber];

        const squares = current.squares.slice();
        if (this.calculateWinner(squares) || squares[i]){
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

        let status;

        if (winner.length > 0) {
            status = 'Winner: ' + current.squares[winner[0]];
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




