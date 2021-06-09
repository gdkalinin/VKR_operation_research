import random as rand
import math
import numpy as np


def investments_task(result=[]):
    investments = rand.randint(4, 9)
    companies = rand.randint(4, 8)
    final = [[0 for j in range(companies)] for i in range(investments)]
    start_value = 15
    for i in range(investments):
        for j in range(companies):
            if i == 0:
                final[i][j] = 0
            else:
                if i == 1:
                    final[i][j] = start_value + rand.randint(0, 5)
                else:
                    if rand.randint(0, 3) != 0:
                        final[i][j] = math.ceil(final[i - 1][j] * rand.uniform(1.15, 1.30))
                    else:
                        final[i][j] = math.ceil(final[i - 1][j])
    result.extend(solve_task(final, companies, investments - 1))

    return {'matrix': final, 'companies': companies, 'investments': investments}


def solve_task(input_arr, companies, investments):
    final = {}
    previous_best = [0]
    last = []
    for j in range(1, investments + 1, 1):
        for k in range(0, j + 1, 1):
            a = [str(j), str(k), str(j - k), str(input_arr[k][companies - 1]),
                 str(math.floor(k / j) * input_arr[k][companies - 1]),
                 str(math.floor(k / j) * k)]
            if a[4] == '0':
                a[4] = ''
            else:
                previous_best.append(a[4])
                final.update({str(1) + str(j): str(a[4]) + ',' + str(a[5])})

            if a[5] == '0':
                a[5] = ''
            if len(last) > 0:
                last = np.append(last, [a], 0)

            else:
                last = [a]
    if len(last) != 0:
        addition = [['e' + str(companies - 1), 'u' + str(companies),
                     'e' + str(companies) + '=e' + str(companies - 1) + '-u' + str(companies),
                     'f' + str(companies) + '(u' + str(companies) + ')',
                     'F*' + str(companies) + '(e' + str(companies) + ')',
                     'u' + str(companies) + '(e' + str(companies) + ')']]
        last = np.append(addition, last, 0)
    for i in range(companies - 1, 0, -1):

        last = []
        for j in range(1, investments + 1, 1):
            max = 0
            for k in range(0, j + 1, 1):
                a = [str(j), str(k), str(j - k), str(input_arr[k][i - 1]), previous_best[j - k],
                     str(input_arr[k][i - 1] + int(previous_best[j - k])),
                     '',
                     '']
                if int(input_arr[max][i - 1] + int(previous_best[j - max])) < input_arr[k][i - 1] + int(
                        previous_best[j - k]):
                    max = k
                if len(last) > 0:
                    last = np.append(last, [a], 0)
                else:
                    last = [a]
            last[len(last) - 1 - j + max][6] = str(input_arr[max][i - 1] + int(previous_best[j - max]))
            last[len(last) - 1 - j + max][7] = last[len(last) - 1 - j + max][1]
        previous_best = [0]
        for m in range(len(last)):
            if last[m][6] != '':
                previous_best.append(last[m][6])
                final.update(
                    {str(companies - i + 1) + str(last[m][0]): str(last[m][6]) + ',' + str(last[m][7])})
        if len(last) != 0:
            addition = [['e' + str(i - 1), 'u' + str(i),
                         'e' + str(i) + '=e' + str(i - 1) + '-u' + str(i),
                         'f' + str(i) + '(u' + str(i) + ')',
                         'F*' + str(i) + '(e' + str(i) + ')',
                         'F' + str(i - 1) + '(u' + str(i) + 'e' + str(i) + ')',
                         'F*' + str(i) + '(e' + str(i) + ')',
                         'u' + str(i) + '(e' + str(i) + ')']]
            last = np.append(addition, last, 0)
    max = previous_best[len(previous_best) - 1]
    answer = []
    for i in range(0, companies):
        if (investments != 0):
            args, invs1 = (final[str(companies - i) + str(investments)].split(','))
        else:
            args, invs1 = 0, 0
        # answer += str(i + 1) + '-ому предприятию нужно выделить ' + str(invs1) + " У.Е. инвестиций, "
        answer.append(invs1)
        investments -= int(invs1)
    answer.append(max)
    return answer
