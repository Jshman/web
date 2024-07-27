def tier_to_mmr(Rank):
    base_mmr = {
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
    }

    sub_tier_offset = {
        "4": 0,
        "3": 100,
        "2": 200,
        "1": 300,
        "0": 0,
    }
    
    tier, sub_tier = Rank.split()
    if tier in base_mmr and sub_tier in sub_tier_offset:
        return base_mmr[tier] + sub_tier_offset[sub_tier]
    else:
        raise ValueError("Invalid tier or sub_tier")

if __name__ == "__main__":
    None
