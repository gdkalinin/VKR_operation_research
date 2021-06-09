import random as rand
from sympy import Rational
import numpy as np
import fractions
from math import floor
import simplex as simp


def gomori_task(result_array):
    # Точки записываются в формате a, b, c
    point = []

    point = [rand.randint(7, 15), rand.randint(7, 15), rand.randint(7, 15)]
    points_array = [[0, 0, 0], [0, 0, 0], [0, 0, 0], [0, 0, 0]]
    current_float = rand.randint(0, len(points_array) - 1)
    points_array[current_float] = point
    points = [0, 1, 2, 3]
    points.remove(current_float)
    next_rand = points[rand.randint(0, len(points) - 1)]
    points_array[next_rand][0] = rand.randint(1, points_array[current_float][0] - 1)
    points.remove(next_rand)
    next_rand = points[rand.randint(0, len(points) - 1)]
    points_array[next_rand][2] = rand.randint(1, points_array[current_float][2] - 1)
    points_array[current_float][0], points_array[current_float][2] = 0, 0
    points_array[current_float][1] += 0.5

    result_array.append(plane(points_array[0], points_array[1], points_array[2]))
    result_array.append(plane(points_array[1], points_array[2], points_array[3]))
    result_array.append(plane(points_array[2], points_array[3], points_array[0]))
    result_array.append(plane(points_array[3], points_array[0], points_array[1]))

    K = [(points_array[1][0] + points_array[3][0]) / 2, (points_array[1][1] + points_array[3][1]) / 2,
         (points_array[1][2] + points_array[3][2]) / 2]
    M = [(points_array[0][0] + points_array[2][0]) / 2, (points_array[0][1] + points_array[2][1]) / 2,
         (points_array[0][2] + points_array[2][2]) / 2]
    KM = [(K[0] + M[0]) / 2, (K[1] + M[1]) / 2, (K[2] + M[2]) / 2]
    status = []
    for l in range(len(result_array)):
        cur_sum = 0
        for j in range(len(KM)):
            cur_sum += KM[j] * result_array[l][j + 1]
        cur_sum -= result_array[l][0]
        if cur_sum < 0:
            status.append(False)
        else:
            status.append(True)

    result_array.append(line(points_array[current_float]))
    return status


# Составим уравнение плоскости Ax + By + Cz = -D. Будем использовать те же обозначения.
def plane(point_a, point_b, point_c):
    AB = [point_b[0] - point_a[0], point_b[1] - point_a[1], point_b[2] - point_a[2]]
    AC = [point_c[0] - point_a[0], point_c[1] - point_a[1], point_c[2] - point_a[2]]
    i = AB[1] * AC[2] - AB[2] * AC[1]
    k = AB[2] * AC[0] - AB[0] * AC[2]
    j = AB[0] * AC[1] - AB[1] * AC[0]
    d = i * (-point_a[0]) + k * (-point_a[1]) + j * (-point_a[2])
    num = [- d, i, k, j]
    return num


def line(point_a):
    x = int(point_a[0])
    y = point_a[1] * 2
    z = int(point_a[2])
    return [0, -x, -y, -z]


def gomori(source, task_num=1, sights_arr=[]):
    np.set_printoptions(formatter={'all': lambda x: str(fractions.Fraction(x).limit_denominator())})
    result = source
    # result = []
    res = [0, 0, 0]
    sights = sights_arr
    S = simp.Simplex(result, task_num)
    S.simple(result, sights)
    S.calculate(res, False)

    current = -1
    for i in range(len(S.table)):
        if S.table[i][0] - floor(S.table[i][0]) != 0 and (
                current == -1 or S.table[i][0] - floor(S.table[i][0]) > S.table[current][0] - floor(
            S.table[current][0])):
            current = i

    while current != -1:
        for i in range(S.m):
            S.table[i].append(0.0)
        S.n += 1
        new_row = [-(S.table[current][0] - floor(S.table[current][0]))]
        for i in range(1, S.n):
            new_row.append(-(S.table[current][i] - floor((S.table[current][i]))))
        new_row[S.n - 1] = 1
        S.table.insert(len(S.table) - 1, new_row)
        res = [0, 0, 0]

        S.basis.append(S.n - 1)
        S.m += 1
        result = []
        for i in range(len(S.basis)):
            result.append([S.basis[i]])
        result.append([-1])

        result = np.append(result, S.table, axis=1)
        current = -1

        S.calculate(res, False)
        for i in range(len(res)):
            if res[i] - floor(res[i]) != 0:
                for i in range(len(S.table)):
                    if current == -1 or (round(S.table[i][0] - floor(S.table[i][0]), 6) > round(
                            S.table[current][0] - floor(S.table[current][0]), 6)):
                        current = i
                break

    return res
