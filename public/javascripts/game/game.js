// the game itself
var game;
// the spinning wheel
var wheel;
// can the wheel spin?
var canSpin;
// slices (prizes) placed in the wheel
var slices = 8;
// prize names, starting from 12 o'clock going clockwise
var slicePrizes = ["1 giờ chơi", "2 giờ chơi", "5 giờ chơi", "1 coca", "1 giờ chơi", "1 pepsi", "4 giờ chơi", "1 sting"];
// the prize you are about to win
var prize;
// text field where to show the prize
var prizeText;

window.onload = function () {
    // creation of a 458x488 game
    game = new Phaser.Game(458, 488, Phaser.AUTO, "game");
    // adding "PlayGame" state
    game.state.add("PlayGame", playGame);
    // launching "PlayGame" state
    game.state.start("PlayGame");
}

// PLAYGAME STATE

var playGame = function (game) { };

playGame.prototype = {
    // function to be executed once the state preloads
    preload: function () {
        // preloading graphic assets
        game.load.image("wheel", "/javascripts/game/wheel.png");
        game.load.image("pin", "/javascripts/game/pin.png");
    },
    // funtion to be executed when the state is created
    create: function () {
        // giving some color to background
        game.stage.backgroundColor = "#000000";
        // adding the wheel in the middle of the canvas
        wheel = game.add.sprite(game.width / 2, game.width / 2, "wheel");
        // setting wheel registration point in its center
        wheel.anchor.set(0.5);
        // adding the pin in the middle of the canvas
        var pin = game.add.sprite(game.width / 2, game.width / 2, "pin");
        // setting pin registration point in its center
        pin.anchor.set(0.5);
        // adding the text field
        prizeText = game.add.text(game.world.centerX, 480, "", { backgroundColor: '#ffffff' });
        // setting text field registration point in its center
        prizeText.anchor.set(0.5);
        // aligning the text to center
        prizeText.align = "center";
        // the game has just started = we can spin the wheel
        canSpin = true;
        // waiting for your input, then calling "spin" function
        game.input.onDown.add(this.spin, this);
    },
    // function to spin the wheel
    spin() {
        // can we spin the wheel?
        if (canSpin) {
            // now the wheel cannot spin because it's already spinning
            canSpin = false;
            if (vue.user.roll > 0)
                firebase.firestore()
                    .collection('customers')
                    .doc(vue.user._id)
                    .get()
                    .then(r => {
                        if (r.data().roll > 0) {
                            // resetting text field
                            prizeText.text = "";
                            // the wheel will spin round from 2 to 4 times. This is just coreography
                            var rounds = game.rnd.between(4, 8);
                            // then will rotate by a random number from 0 to 360 degrees. This is the actual spin
                            var degrees = game.rnd.between(0, 360);
                            // before the wheel ends spinning, we already know the prize according to "degrees" rotation and the number of slices
                            prize = slices - 1 - Math.floor(degrees / (360 / slices));

                            if (prize == 2 || prize == 6) {
                                if (Math.floor((Math.random() * 10) + 1) > 4) {
                                    degrees = game.rnd.between(0, 360);
                                    prize = slices - 1 - Math.floor(degrees / (360 / slices));
                                }
                            }


                            // animation tweeen for the spin: duration 3s, will rotate by (360 * rounds + degrees) degrees
                            // the quadratic easing will simulate friction
                            var spinTween = game.add.tween(wheel).to({
                                angle: 360 * rounds + degrees
                            }, 3000, Phaser.Easing.Quadratic.Out, true);
                            // once the tween is completed, call winPrize function
                            spinTween.onComplete.add(this.winPrize, this);
                            spinTween.onComplete.addOnce(() => {
                                vue.user.roll = parseInt(r.data().roll) - 1;
                                firebase.firestore()
                                    .collection('customers')
                                    .doc(vue.user._id)
                                    .get()
                                    .then(r => {
                                        firebase.firestore()
                                            .collection('customers')
                                            .doc(vue.user._id)
                                            .update({
                                                roll: parseInt(r.data().roll) - 1,
                                                reward_history: r.data().reward_history.concat({
                                                    datetime: Date.now(),
                                                    reward: slicePrizes[prize]
                                                })
                                            })
                                            .catch(err => console.log(err));
                                    });
                            });
                        }
                        else swal('Lỗi', 'Bạn hết lượt quay!', 'warning');
                    })
                    .catch(err => console.log(err));
            else swal('Lỗi', 'Bạn hết lượt quay!', 'warning');
        }
    },
    // function to assign the prize
    winPrize() {
        // now we can spin the wheel again
        canSpin = true;
        // writing the prize you just won
        prizeText.text = slicePrizes[prize];
    }
}