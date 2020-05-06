import React from "react";


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

export default class Board extends React.Component {
    constructor(props) {
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