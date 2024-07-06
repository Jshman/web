document.addEventListener("DOMContentLoaded", function() {
    const playerForm = document.getElementById("add-player-form");
    const waitingList = document.getElementById("waiting-list");
    const team1Positions = document.getElementById("team1-positions");
    const team2Positions = document.getElementById("team2-positions");
    const team1MMR = document.getElementById("team1-mmr");
    const team2MMR = document.getElementById("team2-mmr");
    const teamBuildButton = document.getElementById("team-build-btn");

    // 티어 정보를 담고 있는 JavaScript 객체
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

    playerForm.addEventListener("submit", function(event) {
        event.preventDefault();

        // 플레이어 정보 가져오기
        const playerName = document.getElementById("player-name").value;
        const playerRank = document.getElementById("player-rank").value;
        const playerPrimaryPos = getPrimaryPosition();
        const playerSecondaryPos = getSecondaryPositions();

        // 플레이어 객체 생성
        const player = {
            name: playerName,
            rank: playerRank,
            primaryPos: playerPrimaryPos,
            secondaryPos: playerSecondaryPos
        };

        // 대기열에 플레이어 추가
        const listItem = document.createElement("li");
        listItem.textContent = `${player.name} (${player.rank}) - 포지션: ${player.primaryPos}, 보조 포지션: ${player.secondaryPos.join(", ")}`;

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "[x]";
        deleteButton.classList.add("delete-button");
        listItem.appendChild(deleteButton);

        waitingList.appendChild(listItem);

        // 삭제 버튼에 이벤트 리스너 추가
        deleteButton.addEventListener("click", function() {
            listItem.remove();
            updateMMR();
        });
    });

    // 팀 짜기 버튼 클릭 시
    teamBuildButton.addEventListener("click", function() {
        const players = Array.from(waitingList.children).map(function(item) {
            return parsePlayerInfo(item.textContent);
        });

        const [team1, team2, team1MMR, team2MMR] = balanceTeams(players);

        // 팀 A 표시
        displayTeam(team1, team1Positions, team1MMR);

        // 팀 B 표시
        displayTeam(team2, team2Positions, team2MMR);
    });

    // MMR 계산 함수
    function calculateMMR(rank) {
        const tier = rank.substring(0, rank.length - 1);
        const subTier = rank.substring(rank.length - 1);

        if (baseMMR.hasOwnProperty(tier) && subTierOffset.hasOwnProperty(subTier)) {
            return baseMMR[tier] + subTierOffset[subTier];
        } else {
            console.error("유효하지 않은 랭크:", rank);
            return 0; // 예외 처리: 유효하지 않은 랭크일 경우 0 반환
        }
    }

    // 플레이어 정보 파싱 함수
    function parsePlayerInfo(playerInfo) {
        const nameStart = playerInfo.indexOf(":") + 2;
        const nameEnd = playerInfo.indexOf("(") - 1;
        const name = playerInfo.substring(nameStart, nameEnd);
        
        const rankStart = nameEnd + 2;
        const rankEnd = playerInfo.indexOf(")") - 1;
        const rank = playerInfo.substring(rankStart, rankEnd);
        
        const primaryPosStart = playerInfo.indexOf(":") + 2;
        const primaryPosEnd = playerInfo.indexOf(",", primaryPosStart);
        const primaryPos = playerInfo.substring(primaryPosStart, primaryPosEnd);

        const secondaryPosStart = primaryPosEnd + 14; // ", 보조 포지션: " 의 길이
        const secondaryPosEnd = playerInfo.length - 1;
        const secondaryPos = playerInfo.substring(secondaryPosStart, secondaryPosEnd).split(", ");

        return {
            name: name,
            rank: rank,
            primaryPos: primaryPos,
            secondaryPos: secondaryPos
        };
    }

    // 팀 나누기 함수
    function balanceTeams(players) {
        // 포지션별 리스트 생성
        const positions = {
            "Top": [],
            "Jungle": [],
            "Mid": [],
            "ADC": [],
            "Support": []
        };

        // 포지션 리스트 채우기
        players.forEach(function(player) {
            const mmr = calculateMMR(player.rank);
            positions[player.primaryPos].push({ name: player.name, mmr: mmr });
            player.secondaryPos.forEach(function(pos) {
                positions[pos].push({ name: player.name, mmr: mmr });
            });
        });

        // 포지션 리스트 정렬
        for (const pos in positions) {
            positions[pos].sort(function(a, b) {
                return b.mmr - a.mmr; // 내림차순 정렬
            });
        }

        // 팀 나누기
        const team1 = {
            "Top": [],
            "Jungle": [],
            "Mid": [],
            "ADC": [],
            "Support": []
        };

        const team2 = {
            "Top": [],
            "Jungle": [],
            "Mid": [],
            "ADC": [],
            "Support": []
        };

        let currentTeam = team1;

        for (const pos in positions) {
            positions[pos].forEach(function(player) {
                currentTeam[pos].push(player.name);
                currentTeam = currentTeam === team1 ? team2 : team1; // 팀 번갈아가면서 추가
            });
        }

        // MMR 평균 계산
        const team1MMR = calculateTeamMMR(team1);
        const team2MMR = calculateTeamMMR(team2);

        return [team1, team2, team1MMR, team2MMR];
    }

    // 팀 MMR 평균 계산 함수
    function calculateTeamMMR(team) {
        let totalMMR = 0;
        let numPlayers = 0;

        for (const pos in team) {
            team[pos].forEach(function(player) {
                totalMMR += calculateMMR(player.rank);
                numPlayers++;
            });
        }

        return Math.round(totalMMR / numPlayers);
    }

    // 팀 표시 함수
    function displayTeam(team, positionsElement, mmrElement) {
        positionsElement.innerHTML = ""; // 기존 내용 비우기

        for (const pos in team) {
            const players = team[pos];
            const positionHeader = document.createElement("h3");
            positionHeader.textContent = pos;
            positionsElement.appendChild(positionHeader);

            players.forEach(function(player) {
                const playerParagraph = document.createElement("p");
                playerParagraph.textContent = `${player} (${calculateMMR(player.rank)})`;
                positionsElement.appendChild(playerParagraph);
            });
        }

        mmrElement.textContent = `MMR 평균: ${calculateTeamMMR(team)}`;
    }

    // 기본 포지션 가져오기 함수
    function getPrimaryPosition() {
        const primaryPositions = Array.from(document.querySelectorAll('input[name="primary-pos"]:checked')).map(function(checkbox) {
            return checkbox.value;
        });
        return primaryPositions.length > 0 ? primaryPositions[0] : "";
    }

    // 보조 포지션 가져오기 함수
    function getSecondaryPositions() {
        const secondaryPositions = Array.from(document.querySelectorAll('input[name="secondary-pos"]:checked')).map(function(checkbox) {
            return checkbox.value;
        });
        return secondaryPositions;
    }

    // 초기 MMR 업데이트
    function updateMMR() {
        team1MMR.textContent = `MMR 평균: ${calculateTeamMMR(team1)}`;
        team2MMR.textContent = `MMR 평균: ${calculateTeamMMR(team2)}`;
    }
});
