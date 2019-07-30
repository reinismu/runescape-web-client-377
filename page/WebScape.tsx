import React from "react";
import { Game } from "../osrs/Game";

export class WebScape extends React.Component {
    static game: Game = null;
    state = { game: null };
    private canvasRef = React.createRef<HTMLCanvasElement>();

    componentDidMount() {
        const canvas = this.canvasRef.current;
        const curGame = new Game(canvas);
        WebScape.game = curGame;
        curGame.initializeApplication(canvas.width, canvas.height);
    }

    render() {
        return (
            <div>
                <canvas
                    ref={this.canvasRef}
                    width={765}
                    height={503}
                    tabIndex={1}
                    onContextMenu={(mouseEvent) => {
                        mouseEvent.preventDefault();
                    }}
                />
            </div>
        );
    }
}
