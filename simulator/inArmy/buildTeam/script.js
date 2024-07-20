// 롤 랭크 티어를 MMR로 변환하는 함수
const baseMMR = {
    "I": 0,
    "B": 500,
    "S": 900,
    "G": 1300,
    "P": 1700,
    "E": 2100,
    "D": 2500,
    "M": 2900,
    "GM": 3000,
    "C": 3100
};

const subTierOffset = {
    "4": 0,
    "3": 100,
    "2": 200,
    "1": 300,
    "0": 0
};

function tierToMMR(tier) {
    const tierName = tier.charAt(0);
    const tierNumber = tier.charAt(2);
    const base = baseMMR[tierName];
    const offset = subTierOffset[tierNumber];
    return base + offset;
}

// 팀 빌드 함수
function balanceTeams(players) {
    let positions = {
        "top": [],
        "jg": [],
        "mid": [],
        "adc": [],
        "sup": []
    };

    // 포지션에 플레이어 추가
    // 포지션 리스트 채우기
    for (let player of players) {
        let [name, rank, primary_pos, ...secondary_pos] = player;
        let mmr = tierToMMR(rank);
        console.log({ name, mmr, position: primary_pos });
        positions[primary_pos].push({ name, mmr, position: primary_pos });
        for (let pos of secondary_pos) {
            positions[pos].push({ name, mmr, position: pos });
        }
    }
    // 포지션 순서 랜덤 섞기
    let positionOrder = ["top", "jg", "mid", "adc", "sup"];
    shuffleArray(positionOrder);

    let team1 = [];
    let team2 = [];
    let team1MMR = 0;
    let team2MMR = 0;
    let team1AssignedPositions = new Set();
    let team2AssignedPositions = new Set();
    let assignedPlayers = new Set();

    // 포지션 별로 플레이어 배정
    positionOrder.forEach(pos => {
        players.forEach(player => {
            let [name, rank, primaryPos, ...secondaryPos] = player;
            if (assignedPlayers.has(name)) return;
            if (primaryPos === pos || secondaryPos.includes(pos)) {
                let mmr = tierToMMR(rank);
                if (team1MMR <= team2MMR && !team1AssignedPositions.has(pos)) {
                    team1.push({ name, mmr, pos });
                    team1MMR += mmr;
                    team1AssignedPositions.add(pos);
                    assignedPlayers.add(name);
                } else if (!team2AssignedPositions.has(pos)) {
                    team2.push({ name, mmr, pos });
                    team2MMR += mmr;
                    team2AssignedPositions.add(pos);
                    assignedPlayers.add(name);
                }
            }
        });
    });

    // 남은 플레이어 배정
    positionOrder.forEach(pos => {
        players.forEach(player => {
            let [name, rank, primaryPos, ...secondaryPos] = player;
            if (assignedPlayers.has(name)) return;
            let mmr = tierToMMR(rank);
            if (team1.length < 5 && !team1AssignedPositions.has(pos)) {
                team1.push({ name, mmr, pos });
                team1MMR += mmr;
                team1AssignedPositions.add(pos);
                assignedPlayers.add(name);
            } else if (team2.length < 5 && !team2AssignedPositions.has(pos)) {
                team2.push({ name, mmr, pos });
                team2MMR += mmr;
                team2AssignedPositions.add(pos);
                assignedPlayers.add(name);
            }
        });
    });

    // 남은 플레이어들을 두 팀에 배정하여 팀을 5명으로 완성
    players.forEach(player => {
        let [name, rank, primaryPos] = player;
        if (!assignedPlayers.has(name)) {
            let mmr = tierToMMR(rank);
            if (team1.length < 5) {
                team1.push({ name, mmr, primaryPos });
                team1MMR += mmr;
                assignedPlayers.add(name);
            } else if (team2.length < 5) {
                team2.push({ name, mmr, primaryPos });
                team2MMR += mmr;
                assignedPlayers.add(name);
            }
        }
    });

    return { team1, team2, team1MMR, team2MMR };
}

// 팀 결과를 HTML에 출력하는 함수
function displayTeams(team1, team2, team1MMR, team2MMR) {
    const team1Element = document.getElementById('team1');
    const team2Element = document.getElementById('team2');
    const team1MMRElement = document.getElementById('team1MMR');
    const team2MMRElement = document.getElementById('team2MMR');

    team1Element.innerHTML = '';
    team2Element.innerHTML = '';

    // 각 팀별로 포지션 순서대로 정렬
    const roles = ['top', 'jg', 'mid', 'adc', 'sup'];

    roles.forEach(role => {
        // Team 1 출력
        const playersTeam1 = team1.filter(player => player.pos === role);
        playersTeam1.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.textContent = `${player.pos}: ${player.mmr} ${player.name}`;
            playerDiv.className = 'draggable';
            playerDiv.draggable = true;
            playerDiv.ondragstart = drag;
            team1Element.appendChild(playerDiv);
        });

        // Team 2 출력
        const playersTeam2 = team2.filter(player => player.pos === role);
        playersTeam2.forEach(player => {
            const playerDiv = document.createElement('div');
            playerDiv.textContent = `${player.pos}: ${player.mmr} ${player.name}`;
            playerDiv.className = 'draggable';
            playerDiv.draggable = true;
            playerDiv.ondragstart = drag;
            team2Element.appendChild(playerDiv);
        });
    });

    team1MMRElement.textContent = `Team 1 Total MMR: ${team1MMR}`;
    team2MMRElement.textContent = `Team 2 Total MMR: ${team2MMR}`;
}

// 버튼 클릭 시 팀 빌드 및 결과 출력
function buildTeams() {
    const players = [
        ["조준호", "M 0", "jg", "top", "mid", "adc"],
        ["차주훈", "D 2", "sup", "adc", "mid"],
        ["전포대장님", "E 2", "mid", "top"],
        ["박종현", "P 4", "sup", "top"],
        ["위지환", "B 2", "adc", "top"],
        ["이천지", "G 4", "sup", "jg", "mid", "top"],
        ["김도균", "S 4", "top"],
        ["박재영", "G 3", "top", "mid", "jg"],
        ["포대장님", "B 3", "sup"],
        ["황지민", "S 1", "adc", "top", "mid"]
    ];

    const { team1, team2, team1MMR, team2MMR } = balanceTeams(players);
    displayTeams(team1, team2, team1MMR, team2MMR);
}

// 배열을 랜덤하게 섞는 함수
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}

// 드래그 앤 드롭 관련 함수
function allowDrop(event) {
    event.preventDefault();
}

function drag(event) {
    event.dataTransfer.setData("text", event.target.textContent);
    event.dataTransfer.setData("parentId", event.target.parentNode.id);
}

function drop(event) {
    event.preventDefault();
    const data = event.dataTransfer.getData("text");
    const parentId = event.dataTransfer.getData("parentId");
    const targetId = event.target.id;

    if (event.target.className.includes('teamDropZone') && parentId !== targetId) {
        const playerDiv = document.createElement('div');
        playerDiv.textContent = data;
        playerDiv.className = 'draggable';
        playerDiv.draggable = true;
        playerDiv.ondragstart = drag;
        event.target.appendChild(playerDiv);

        const parent = document.getElementById(parentId);
        const children = Array.from(parent.children);
        for (let child of children) {
            if (child.textContent === data) {
                parent.removeChild(child);
                break;
            }
        }

        updateTeamMMR();
    }
}

function updateTeamMMR() {
    const team1Element = document.getElementById('team1');
    const team2Element = document.getElementById('team2');
    const team1MMRElement = document.getElementById('team1MMR');
    const team2MMRElement = document.getElementById('team2MMR');

    const team1Players = Array.from(team1Element.children);
    const team2Players = Array.from(team2Element.children);

    const calculateMMR = (players) => {
        return players.reduce((total, playerDiv) => {
            const playerMMR = parseInt(playerDiv.textContent.split(': ')[1].split(' ')[0]);
            return total + playerMMR;
        }, 0);
    };

    const team1MMR = calculateMMR(team1Players);
    const team2MMR = calculateMMR(team2Players);

    team1MMRElement.textContent = `Team 1 Total MMR: ${team1MMR}`;
    team2MMRElement.textContent = `Team 2 Total MMR: ${team2MMR}`;
}
