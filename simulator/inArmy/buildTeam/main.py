import random
from collections import defaultdict
from getMMR import tier_to_mmr

def balance_teams(players):
    # 포지션별 리스트 생성
    positions = defaultdict(list)
    
    # 포지션 리스트 채우기
    for player in players:
        name, rank, primary_pos, *secondary_pos = player
        mmr = tier_to_mmr(rank)
        positions[primary_pos].append((name, mmr, primary_pos))
        for pos in secondary_pos:
            positions[pos].append((name, mmr, pos))
    
    # 포지션 리스트 섞기
    for pos in positions:
        random.shuffle(positions[pos])
    
    # 포지션 순서 랜덤 섞기
    position_order = ["Top", "Jungle", "Mid", "ADC", "Support"]
    random.shuffle(position_order)
    
    team1 = []
    team2 = []
    team1_mmr = 0
    team2_mmr = 0
    team1_assigned_positions = set()
    team2_assigned_positions = set()
    assigned_players = set()
    
    # 플레이어들을 포지션 수에 따라 정렬
    players_sorted = sorted(players, key=lambda x: len(x) - 2)

    # 유저 배정
    for pos in position_order:
        for player in players_sorted:
            name, rank, primary_pos, *secondary_pos = player
            if name in assigned_players:
                continue
            if primary_pos == pos or pos in secondary_pos:
                mmr = tier_to_mmr(rank)
                if team1_mmr <= team2_mmr and pos not in team1_assigned_positions:
                    team1.append((name, mmr, pos))
                    team1_mmr += mmr
                    team1_assigned_positions.add(pos)
                    assigned_players.add(name)
                elif pos not in team2_assigned_positions:
                    team2.append((name, mmr, pos))
                    team2_mmr += mmr
                    team2_assigned_positions.add(pos)
                    assigned_players.add(name)
                break

    # 남은 유저 배정
    for pos in position_order:
        for player in players_sorted:
            name, rank, primary_pos, *secondary_pos = player
            if name in assigned_players:
                continue
            mmr = tier_to_mmr(rank)
            if len(team1) < 5 and pos not in team1_assigned_positions:
                team1.append((name, mmr, pos))
                team1_mmr += mmr
                team1_assigned_positions.add(pos) #primary_pos
                assigned_players.add(name)
            elif len(team2) < 5 and pos not in team2_assigned_positions:
                team2.append((name, mmr, pos))
                team2_mmr += mmr
                team2_assigned_positions.add(pos) #primary_pos
                assigned_players.add(name)
    
    # 각 팀에 5명이 되도록 추가 배정
    remaining_players = [p for p in players if p[0] not in assigned_players]
    random.shuffle(remaining_players)
    for player in remaining_players:
        name, rank, primary_pos = player[:3]
        mmr = tier_to_mmr(rank)
        if len(team1) < 5:
            team1.append((name, mmr, primary_pos))
            team1_mmr += mmr
        elif len(team2) < 5:
            team2.append((name, mmr, primary_pos))
            team2_mmr += mmr
    
    return team1, team2, team1_mmr, team2_mmr

# 예시 입력
players = [
    ("조준호", "M 0", "Jungle", "Top", "Mid", "ADC"),
    ("차주훈", "D 2", "Support", "ADC", "Mid"),
    ("전포대장님", "E 2", "Mid", "Top"),
    ("박종현", "P 4", "Support", "Top"),
    ("위지환", "B 2", "ADC", "Top"),
    ("이천지", "G 4", "Support", "Jungle", "Mid", "Top"),
    ("김도균", "S 4", "Top"),
    ("박재영", "G 3", "Top", "Mid", "Jungle"),
    ("포대장님", "I 3", "Top"),
    ("황지민", "S 1", "Jungle", "Top", "Mid", "ADC")
]

team1, team2, team1_mmr, team2_mmr = balance_teams(players)

sorted_team1 = sorted(team1, key=lambda x: ['Top', 'Jungle', 'Mid', 'ADC', 'Support'].index(x[2]))
sorted_team2 = sorted(team2, key=lambda x: ['Top', 'Jungle', 'Mid', 'ADC', 'Support'].index(x[2]))


roles = ['Top', 'Jg', 'Mid', 'ADC', 'Sup']

for role_index in range(len(roles)):
    player1 = sorted_team1[role_index]
    player2 = sorted_team2[role_index]
    print(f"{roles[role_index]}: {player1[1]:<8} {player1[0]} | {player2[0]:<8} {player2[1]}")
print(f"mmr average: {team1_mmr} \t | \t {team2_mmr}")
print()
print("Team 1:", sorted_team1)
print("Team 1 Total MMR:", team1_mmr)
print("Team 2:", sorted_team2)
print("Team 2 Total MMR:", team2_mmr)
