let Mines={
    fields: { //All the fields
        mines: [],
        playerMarks: [],
        numbers: []
    },
    countMines: function (x, y) { //Count the number of adjacent mines
        let sum=0;
        if (x>0) {
            sum+=(
                ((y>0)?Mines.fields.mines[x-1][y-1]:0)+ //so apparently it doesn't like to add out-of-range elements (well, undefineds)
                (Mines.fields.mines[x-1][y])+
                ((y<Mines.fields.mines[0].length-1)?Mines.fields.mines[x-1][y+1]:0)
            );
        }
        sum+=(
            ((y>0)?Mines.fields.mines[x][y-1]:0)+
            (Mines.fields.mines[x][y])+
            ((y<Mines.fields.mines[0].length-1)?Mines.fields.mines[x][y+1]:0)
        );
        if (x<Mines.fields.mines.length-1) {
            sum+=(
                ((y>0)?Mines.fields.mines[x+1][y-1]:0)+
                (Mines.fields.mines[x+1][y])+
                ((y<Mines.fields.mines[0].length-1)?Mines.fields.mines[x+1][y+1]:0)
            );
        }
        return sum;
    },
    genField: function (width, height, mines) {
        //mines
        this.fields.mines=[];
        let lineField="0".repeat(width*height-mines)
        for (let i=0;i<mines;i++) {
            let index=Math.floor(Math.random()*(lineField.length+1));
            lineField=lineField.slice(0,index)+"1"+lineField.slice(index);
        }
        for (let x=0;x<width;x++) {
            let column=lineField.slice(x*height,(x+1)*height).split("");
            for (let y=0;y<height;y++) {
                column[y]=+column[y];
            }
            this.fields.mines.push(column);
        }
        //playerMarks
        //this.fields.playerMarks=(new Array(width)).fill((new Array(height)).fill(0));
        this.fields.playerMarks=[];
        for (let x=0;x<width;x++) {
            let column=[];
            for (let y=0;y<height;y++) {
                column.push(0);
            }
            this.fields.playerMarks.push(column);
        }
        //numbers
        this.fields.numbers=[];
        for (let x=0;x<width;x++) {
            this.fields.numbers[x]=[];
            for (let y=0;y<height;y++) {
                this.fields.numbers[x][y]=this.countMines(x,y);
            }
        }
    },
    draw: {
        number: function (x,y,n,size=20) {
            ctx.textAlign="center";
            ctx.textBaseline="middle";
            ctx.font="bold "+size*0.8+"px sans-serif";
            
            if      (n===0) ctx.fillStyle="Gray";
            else if (n===1) ctx.fillStyle="CornflowerBlue";
            else if (n===2) ctx.fillStyle="DarkGreen";
            else if (n===3) ctx.fillStyle="Brown";
            else if (n===4) ctx.fillStyle="DarkBlue";
            else if (n===5) ctx.fillStyle="Crimson";
            else if (n===6) ctx.fillStyle="Aqua";
            else if (n===7) ctx.fillStyle="BlueViolet"; //uhh
            else if (n===8) ctx.fillStyle="DarkOrange"; //pumpkin!
            else console.log("maybe there's a bug");

            ctx.fillText(n+"",(x+0.5)*size,(y+0.5)*size);
        },
        flag: function (x,y,size=20) {
            let p={
                xo: x*size, yo: y*size,
                p1: [0.3*size,0.9*size],
                p2: [0.3*size,0.1*size],
                p3: [0.7*size,0.3*size],
                p4: [0.3*size,0.5*size]
            };
            ctx.beginPath();
            ctx.moveTo(p.p1[0]+p.xo,p.p1[1]+p.yo);
            ctx.lineTo(p.p2[0]+p.xo,p.p2[1]+p.yo);
            ctx.lineTo(p.p3[0]+p.xo,p.p3[1]+p.yo);
            ctx.lineTo(p.p4[0]+p.xo,p.p4[1]+p.yo);
            ctx.closePath();
            ctx.fillStyle="red";
            ctx.fill();
            ctx.strokeStyle="black";
            ctx.lineWidth=0.02*size;
            ctx.stroke();
        },
        cell: function (x,y,size=20) {
            ctx.fillStyle="gray";
            ctx.fillRect(x*size,y*size,size,size);
        },
        mine: function (x,y,size=20) {
            ctx.fillStyle="red";
            ctx.fillRect(x*size,y*size,size,size);
        }
    },
    render: function (size=20,hackmode=false) {
        /*
        remember to add canvas resizer
        */
        
        let fieldSize=[
            this.fields.mines.length,
            (this.fields.mines[0])?(this.fields.mines[0].length):0
        ];
        //clear
        ctx.clearRect(0,0,fieldSize[0]*size,fieldSize[1]*size);
        //background
        ctx.fillStyle="#DDDDDD";
        ctx.fillRect(0,0,fieldSize[0]*size,fieldSize[1]*size);
        //cells
        for (let x=0;x<this.fields.mines.length;x++) {
            for (let y=0;y<this.fields.mines[0].length;y++) { //would've added the same check, but nah, the loop wouldn't run in this case anyways
                if ( //unrevealed cells
                    this.fields.playerMarks[x][y]===0 ||
                    this.fields.playerMarks[x][y]===2
                ) {
                    this.draw.cell(x,y,size);
                }
                if ( //revealed cells - numbers
                    this.fields.playerMarks[x][y]===1
                ) {
                    this.draw.number(x,y,this.fields.numbers[x][y],size);
                }
                if ( //hackmode/failure
                    hackmode && this.fields.mines[x][y]
                ) {
                    this.draw.mine(x,y,size);
                }
                if ( //flags
                    this.fields.playerMarks[x][y]===2
                ) {
                    this.draw.flag(x,y,size);
                }
            }
        }
        ctx.strokeStyle="#404040";
        ctx.lineWidth=0.1*size;
        for (let x=1;x<fieldSize[0];x++) {
            ctx.beginPath();
            ctx.moveTo(x*size,0);
            ctx.lineTo(x*size,fieldSize[1]*size);
            ctx.stroke();
        }
        for (let y=1;y<fieldSize[1];y++) {
            ctx.beginPath();
            ctx.moveTo(0,y*size);
            ctx.lineTo(fieldSize[0]*size,y*size);
            ctx.stroke();
        }
        ctx.strokeStyle="black";
        ctx.lineWidth=0.1*size;
        ctx.strokeRect(0,0,fieldSize[0]*size,fieldSize[1]*size);
    },
    checkWin: function () {
        for (column of Mines.fields.playerMarks) {
            if (column.includes(0)) return false;
        }
        return true;
    },
    rightClick: function (x,y) {
        if      (this.fields.playerMarks[x][y]===0) this.fields.playerMarks[x][y]=2;
        else if (this.fields.playerMarks[x][y]===2) this.fields.playerMarks[x][y]=0;
    },
    leftClick: function (x,y) { //the *engine* of the game
        if (this.fields.playerMarks[x][y]===0) {
            if (this.fields.mines[x][y]) return 0;
            else {
                this.fields.playerMarks[x][y]=1;
                return 1;
            }
        }
    },
};