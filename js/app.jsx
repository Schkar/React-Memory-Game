class Card extends React.Component{
    constructor(props){
        super(props)
    }

    handleClick = () => {
        // if (!this.props.flipActive) {
        //     return;
        // }
        if (typeof this.props.statusChange === "function") {
            this.props.statusChange(this.props.id)
        }
    }

    render(){
        let activeClassName="fa fa-" + this.props.symbol;
        return (
            <React.Fragment>
            {
                this.props.visible ? (
                    this.props.active ? (
                       <div className="card active" style={this.props.style} onClick={this.handleClick}>
                            <i className={activeClassName} style={this.props.style}></i>
                        </div>
                    ) : (
                        <div className="card" style={this.props.style} onClick={this.handleClick}>
                            <i className="fa" style={this.props.style}></i>
                        </div>
                    )
                ) : (
                    <div style={this.props.style}></div>
                )      
            }
            </React.Fragment>
        )
    }
}

class Button extends React.Component{
    constructor(props){
        super(props)
    }

    handleClick = () => {
        if (typeof this.props.start === "function") {
            this.props.start(this.props.cols,this.props.rows);
        }
    }

    render(){
        return(
            <button className="startButton" onClick={this.handleClick}>{this.props.text}</button>
        )
    }
}

class Pointer extends React.Component{
    constructor(props){
        super(props)
    }

    render(){
        return(
            <p className="pointer">Points: {this.props.points}</p>
        )
    }
}

class Area extends React.Component{
    constructor(props){
        super(props)

        this.state = {
            symbols: ["coffee","cog","compass","beer","cut","gamepad","trophy","credit-card","flask","save","headphones","home","car","calculator","camera","bicycle","book","plane"],
            columns: 0,
            rows: 0,
            cards: [],
            points: 0,
            generate: false,
            flipActive: true,
            activeCards: []
        }
    }

    statusChange = (id) =>{
        let activeArray = this.state.activeCards
        let newArray = this.state.cards.map((e) => {
            if (e.id === id) {
                e.active = !e.active;
                activeArray.push(e.symbol) 
            }
            return e
        })
        this.setState({
            cards: newArray,
            activeCards: activeArray
        })
        setTimeout(this.checkAnswers,2000)
    }

    flipAll = () => {
        if (this.state.activeCards.length === 2) {
            let newArray = this.state.cards.map( (e) => {
                e.active = false;
                return e;
            })
            this.setState({
                cards: newArray,
                activeCards: []
            })   
        }
    }

    checkAnswers = () => {
        if (this.state.activeCards[0] === this.state.activeCards[1]) {
            let newPoints = this.state.points;
            newPoints++;
            let tempArray = this.state.cards.map( (e) => {
                if (e.symbol === this.state.activeCards[0]) {
                    e.visible = false;
                    e.active = false;
                }
                return e
            })
            this.setState({
                cards: tempArray,
                points: newPoints
            })
        }
        this.flipAll()
    }

    generateCardArray = (cols,rows) =>{
        let tempSymbolArray = this.state.symbols.concat(this.state.symbols);
        tempSymbolArray.sort();
        tempSymbolArray.length = cols*rows;
        let tempCardArray = [];
        for (let i = 0; i < cols*rows; i++){
            let randomNumber = ~~(Math.random()*(tempSymbolArray.length)-1);
            tempCardArray.push(
                {
                    visible: true,
                    active: false,
                    symbol: tempSymbolArray[randomNumber],
                    id: tempSymbolArray[randomNumber]+i
                }
            );
            tempSymbolArray.splice(randomNumber,1);
        }
        this.setState({
            generate: true,
            columns: cols,
            rows: rows,
            cards: tempCardArray
        });
    }

    render(){
        const cardStyle = {
            width: 600/this.state.columns,
            height: 600/this.state.rows,
            lineHeight: 600/this.state.rows + "px"
        }        
        return(
            <React.Fragment>
                <div className="buttons">
                    <Button className="startButton" cols={4} rows={4} start={this.generateCardArray} text={"Small"}/>
                    <Button className="startButton" cols={6} rows={4} start={this.generateCardArray} text={"Medium"}/>
                    <Button className="startButton" cols={6} rows={6} start={this.generateCardArray} text={"Large"}/>
                </div>
                <Pointer points={this.state.points}/>
                <div className="area">
                    { this.state.generate ? this.state.cards.map((e) => {
                        return (
                            <Card style={cardStyle} key={e.id} id={e.id} symbol={e.symbol} visible={e.visible} active={e.active} statusChange={this.statusChange}/>
                        )
                    }) : null }  
                </div>
            </React.Fragment>
        )
    }
}

ReactDOM.render(
    <Area/>,
    document.getElementById("root")
)

