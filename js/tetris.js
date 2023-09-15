const playground = document.querySelector(".playground > ul");

//setting
const GAME_ROWS = 20;
const GAME_COlS = 10;

const gameText = document.querySelector(".game.text");

//variables
let score = 0;
let duration = 500;
let downInterval;
let tempMovingItem;

const BLOCKS = {
  tree: [
    [[2, 1], [0, 1], [1, 0], [1, 1]],
    [[1, 2], [0, 1], [1, 0], [1, 1]],
    [[1, 2], [0, 1], [2, 1], [1, 1]],
    [[2, 1], [1, 2], [1, 0], [1, 1]],
  ]
}

const movingItem = {
  type:"tree",
  direction: 3,
  top: 0,
  left: 0,

}

init()

//function
function init() {
  // const blockArray = Object.entries(BLOCKS)
  // blockArray.forEach(block => {
  // })
  // const randomindex = Math.floor(Math.random()*6)
  // blockArray[randomindex][0]
  tempMovingItem = { ...movingItem };
  for(let i=0; i< 20; i++) {
    prependNewLine()
  }
  renderBlocks()
  // generateNewBlock()
}

function prependNewLine() {
  const li = document.createElement("li");
  const ul = document.createElement("ul");

  for(let j=0; j<10; j++) {
    const matrix = document.createElement("li");
    ul.prepend(matrix);
  }
  li.prepend(ul);
  playground.prepend(li);
}

function renderBlocks(moveType="") {
  const { type, direction, top, left } = tempMovingItem;
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach(moving => {
    moving.classList.remove(type, "moving");
  })
  BLOCKS[type][direction].some(block=>{
    const x = block[0] + left;
    const y = block[1] + top;
    
    const target = playground.childNodes[y] ? playground.childNodes[y].childNodes[0].childNodes[x] : null;
    const isAvailable = checkEmpty(target);
    if(isAvailable) {
      target.classList.add(type, "moving")
    }else {
      tempMovingItem = { ...movingItem }
      if(moveType === 'retry') {
        downInterval(setInterval);
        showGameoverText()
      }
      setTimeout(()=>{
        renderBlocks('retry')
        if(moveType === "top"){
          seizeBlock();
        }      
      }, 0)
      return true;
    }
    
  })
  movingItem.left = left;
  movingItem.top = top;
  movingItemdirection = direction;
}

function seizeBlock() {
  const movingBlocks = document.querySelectorAll(".moving");
  movingBlocks.forEach(moving => {
    moving.classList.remove("moving");
    moving.classList.add("seized");
  })
  checkMatch()
 
}

function checkMatch() {
  const childNodes = playground.childNodes;
  childNodes.forEach(child=>{
    let matched = true;
    child.children[0].childNodes.forEach(li=>{
      if(!li.classList.contains("seized")) {
        matched = false;
      }
    })
    if(matched) {
      child.remove();
    }
  })
  generateNewBlock()
}

function generateNewBlock() {

  clearInterval(downInterval);
  downInterval = setInterval(() => {
    moveBlock('top', 1)
  }, duration)
  // const blockArray = Object.entries(BLOCKS);
  // const randomindex = Math.floor(Math.random() * blockArray.length)
  // movingItem.type = blockArray[randomindex][0],
  movingItem.top = 0;
  movingItem.left = 3;
  movingItem.direction = 0;
  tempMovingItem = { ...movingItem };
  renderBlocks();
}

function checkEmpty(target){
  if( !target || target.classList.contains("seized") ){
    return false;
  }
  return true;
}

function moveBlock(moveType, amount) {
  tempMovingItem[moveType] += amount;
  renderBlocks(moveType);
}

function changeDirection() {
  const direction = tempMovingItem.direction;
  direction === 3 ? tempMovingItem.direction = 0 : tempMovingItem.direction += 1;
  renderBlocks(); 
}

function dropBlock() {
  clearInterval(downInterval);
  downInterval = setInterval(()=>{
    moveBlock('top', 1)
  }, 10)
}

function showGameoverText() {
  
}

//event handling
document.addEventListener("keydown", e=>{
  switch(e.keyCode) {
    case 39:
      moveBlock("left", 1);
      break;
    case 37:
      moveBlock("left", -1);
      break;
    case 40:
      moveBlock("top", 1);
      break;
    case 38:
      changeDirection();
      break;
    case 32:
      dropBlock();
      break;
    default:
      break;
  }
})