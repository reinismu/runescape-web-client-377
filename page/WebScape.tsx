import React from "react";
import { Game } from "../osrs/Game";

interface State {
    // game: Game | null;
}


if (module.hot) {
    module.hot.accept(function() {
        // module or one of its dependencies was just updated
        console.log("accepted reload");
      });
}
export class WebScape extends React.Component<{}, State> {
    static game: Game = null
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
                <canvas ref={this.canvasRef} width={765} height={503} tabIndex={1} />
            </div>
        );
    }
}
