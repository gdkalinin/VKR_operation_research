import random as rand


def equipment_update(answer=[]):
    cost = rand.randint(10, 25)
    age = rand.randint(1, 3)
    period = rand.randint(5, 10)
    income = [cost * 2 + rand.randint(0, 5)]
    expens = [cost + rand.randint(1, 6)]
    residual_value = [cost - rand.randint(3, 8)]
    for i in range(1, period + 1):
        income.append(income[i - 1] - rand.randint(0, 2))
        residual_value.append(residual_value[i - 1] - rand.randint(1, 3))
        expens.append(expens[i - 1] + rand.randint(0, 2))
        if residual_value[i] < 6:
            residual_value[i] = 6
    profit = []
    for i in range(0, period + 1):
        profit.append(income[i] - expens[i])
    answer.extend(solve_task(cost, age, period, income, expens, residual_value))
    return {'cost': cost, 'age': age, 'period': period, 'income': income, 'expens': expens, "residual_value": residual_value}


def solve_task(cost, age, period, income, expens, redisual_value):
    for i in range(period + 1):
        income[i] -= expens[i]
    last_best = []
    dict = {}
    for j in range(0, period - 0):
        if age == 1:
            if age - 1 + j <= period:
                if income[j + 1] >= redisual_value[j + 1] - cost + income[0]:
                    last_best.append(income[j + 1])
                    dict.update({str(period) + str(j + 1): str(last_best[len(last_best) - 1]) + ',' + 'С'})

                else:
                    last_best.append(redisual_value[j + 1] - cost + income[0])
                    dict.update({str(period) + str(j + 1): str(last_best[len(last_best) - 1]) + ',' + 'З'})

            else:
                last_best.append(redisual_value[j + 1] - cost + income[0])
                dict.update({str(period) + str(j + 1): str(last_best[len(last_best) - 1]) + ',' + 'З'})
        else:
            if age - 1 + j <= period:
                if income[j + 1] + redisual_value[age - 1 + j] >= redisual_value[j + 1] - cost + income[0] + \
                        redisual_value[1]:
                    last_best.append(income[j + 1] + redisual_value[age - 1 + j])
                    dict.update({str(period) + str(j + 1): str(last_best[len(last_best) - 1]) + ',' + 'С'})

                else:
                    last_best.append(redisual_value[j + 1] - cost + income[0] + redisual_value[1])
                    dict.update({str(period) + str(j + 1): str(last_best[len(last_best) - 1]) + ',' + 'З'})

            else:
                last_best.append(redisual_value[j + 1] - cost + income[0] + redisual_value[1])
                dict.update({str(period) + str(j + 1): str(last_best[len(last_best) - 1]) + ',' + 'З'})

    for i in range(1, len(income) - 1):
        new_last_best = []
        for j in range(0, period - i):
            if j + 1 != period:
                if income[j + 1] + last_best[j + 1] >= redisual_value[j + 1] - cost + income[0] + \
                        last_best[0]:
                    new_last_best.append(income[j + 1] + last_best[j + 1])
                    dict.update({str(period - i) + str(j + 1): str(new_last_best[len(new_last_best) - 1]) + ',' + 'С'})
                else:
                    new_last_best.append(redisual_value[j + 1] - cost + income[0] + last_best[0])
                    dict.update({str(period - i) + str(j + 1): str(new_last_best[len(new_last_best) - 1]) + ',' + 'З'})

            else:
                dict.update(
                    {str(period - i) + str(j + 1): str(new_last_best[len(new_last_best) - 1]) + ',' + 'З'})
        last_best = new_last_best
    n = age
    change = []
    for i in range(n, period + 1):
        profit, role = dict[str(i) + str(age)].split(',')
        if (role == 'З'):
            age = 1
            change.append(i - n + 1)
        else:
            age += 1
    return change