// DOM Elements
const chatWindow = document.getElementById('chatWindow');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const teamList = document.getElementById('teamList');
const playerStatsBody = document.querySelector('#playerStats tbody');
const impactGraph = document.getElementById('impactGraph');
const matchScoreDiv = document.getElementById('matchScore');
const copyBtn = document.getElementById('copyBtn');
const exportBtn = document.getElementById('exportBtn');

// Player database
let players = [
    {name:'Player 1', role:'Batsman', form:9, injury:false},
    {name:'Player 2', role:'Bowler', form:7, injury:false},
    {name:'Player 3', role:'All-rounder', form:8, injury:false},
    {name:'Player 4', role:'Batsman', form:6, injury:true},
    {name:'Player 5', role:'Bowler', form:5, injury:false},
    {name:'Player 6', role:'Batsman', form:8, injury:false},
    {name:'Player 7', role:'All-rounder', form:7, injury:false},
    {name:'Player 8', role:'Bowler', form:6, injury:false},
    {name:'Player 9', role:'Batsman', form:9, injury:false},
    {name:'Player 10', role:'Bowler', form:7, injury:false},
    {name:'Player 11', role:'Batsman', form:8, injury:false}
];

// CMD: Generate Recommended Team
function generateTeam(recommended = null){
    teamList.innerHTML="";
    playerStatsBody.innerHTML="";
    impactGraph.innerHTML="";

    if(!recommended){
        recommended = players.filter(p=>!p.injury).sort((a,b)=>b.form-a.form).slice(0,11);
    }

    // Assign badges
    if(recommended.length>=2){
        recommended[0].badge="Captain";
        recommended[1].badge="Vice-Captain";
    }

    // CMD: Match Strategy Score
    const strategyScore = Math.round(recommended.reduce((sum,p)=>sum+p.form,0)/(recommended.length*10)*100);
    matchScoreDiv.innerText = `Overall Match Strategy Score: ${strategyScore}%`;

    recommended.forEach((p,i)=>{
        // Team List
        const div = document.createElement('div');
        div.innerHTML=`${i+1}. ${p.name} (${p.role}) ${p.badge?`<span style="color:#FFD700">[${p.badge}]</span>`:p.form>=8?'<span style="color:#00FF00">[In-Form]</span>':''}`;
        teamList.appendChild(div);

        // Stats Table
        const row = document.createElement('tr');
        row.innerHTML=`<td>${p.name}</td><td>${p.role}</td><td>${p.form}/10</td><td>${p.injury?'Yes':'No'}</td><td>${p.form*10}%</td><td>${p.badge?p.badge:'-'}</td>`;
        playerStatsBody.appendChild(row);

        // Impact Graph
        const bar = document.createElement('div');
        bar.classList.add('bar');
        bar.style.height=`${p.form*5}px`;
        bar.style.background=`hsl(${p.form*12},70%,50%)`;
        bar.title=`${p.name}: ${p.form*10}% impact`;
        impactGraph.appendChild(bar);
    });
}

// CMD: Chat Function
function getBotResponse(input){
    input = input.toLowerCase();
    let response="";
    if(input.includes("team") || input.includes("recommendation")){
        response="Generating recommended XI based on form, injuries, and opponent...";
        generateTeam();
    } else if(input.includes("pitch")){
        response="Pitch conditions: Batting-friendly. Adjust top order accordingly.";
    } else if(input.includes("weather")){
        response="Weather is sunny, favorable for fast bowlers.";
    } else if(input.includes("form")){
        response="Top form players: Player 1, Player 9, Player 6.";
    } else if(input.includes("injury")){
        response="Player 4 is injured. Consider replacing him in the XI.";
    } else if(input.includes("head-to-head")){
        response="Your team has historically strong performance against this opponent.";
    } else{
        response="I can provide team selection, player form, pitch/weather analysis, injuries, head-to-head stats, and match strategy scoring.";
    }
    return response;
}

// CMD: Add Chat Message
function addMessage(sender,text){
    const msg=document.createElement('div');
    msg.classList.add('message',sender);
    msg.innerHTML=text;
    chatWindow.appendChild(msg);
    chatWindow.scrollTop=chatWindow.scrollHeight;
}

// CMD: Send Message
function sendMessage(){
    const text=userInput.value.trim();
    if(!text) return;
    addMessage('user',text);
    userInput.value="";
    setTimeout(()=>{ addMessage('bot',getBotResponse(text)); },500);
}

// CMD: Event Listeners
sendBtn.addEventListener('click',sendMessage);
userInput.addEventListener('keypress',e=>{ if(e.key==='Enter') sendMessage(); });

// CMD: Copy Recommendation
copyBtn.addEventListener('click',()=>{
    const text = Array.from(teamList.children).map(d=>d.innerText).join('\n');
    navigator.clipboard.writeText(text);
    alert("Team Recommendation copied!");
});

// CMD: Export PDF
exportBtn.addEventListener('click',()=>{ window.print(); });

// CMD: Role Filter Buttons
document.getElementById('filterBatsman').addEventListener('click',()=>{ generateTeam(players.filter(p=>p.role==='Batsman' && !p.injury)); });
document.getElementById('filterBowlers').addEventListener('click',()=>{ generateTeam(players.filter(p=>p.role==='Bowler' && !p.injury)); });
document.getElementById('filterAllRounders').addEventListener('click',()=>{ generateTeam(players.filter(p=>p.role==='All-rounder' && !p.injury)); });
document.getElementById('showAll').addEventListener('click',()=>{ generateTeam(); });

// Initial load
generateTeam();
