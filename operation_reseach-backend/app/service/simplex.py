import random as rand
from fractions import Fraction
import numpy as np
import fractions

def simplex_task(result_array=[]):
    # Точки записываются в формате a, b, c
    main_point = [rand.randint(7, 15), rand.randint(7, 15), rand.randint(7, 15)]
    points_array = [main_point,
                    [0, rand.randint(1, main_point[1] - 1), rand.randint(1, main_point[2] - 1)],
                    [rand.randint(1, main_point[0] - 1), 0, rand.randint(1, main_point[2] - 1)],
                    [rand.randint(1, main_point[0] - 1), rand.randint(1, main_point[1] - 1), 0]]
    result_array.append(plane(points_array[0], points_array[1], points_array[2]))
    result_array.append(plane(points_array[0], points_array[2], points_array[3]))
    result_array.append(plane(points_array[0], points_array[1], points_array[3]))
    result_array.append(plane(points_array[1], points_array[2], points_array[3]))

    K = [(points_array[0][0] + points_array[3][0])/2, (points_array[0][1] + points_array[3][1])/2,
         (points_array[0][2] + points_array[3][2])/2]
    M = [(points_array[1][0] + points_array[2][0])/2, (points_array[1][1] + points_array[2][1])/2,
         (points_array[1][2] + points_array[2][2])/2 ]
    KM = [(K[0] + M[0])/2, (K[1] + M[1])/2, (K[2] + M[2])/2]
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

    first_point = rand.randint(0, 3)
    second_point = rand.randint(0, 3)
    while second_point == first_point:
        second_point = rand.randint(0, 3)

    result_array.append(line(points_array[first_point], points_array[second_point]))

    return status


# Составим уравнение плоскости Ax + By + Cz = -D. Будем использовать те же обозначения.
def plane(point_a, point_b, point_c):
    AB = [point_b[0] - point_a[0], point_b[1] - point_a[1], point_b[2] - point_a[2]]
    AC = [point_c[0] - point_a[0], point_c[1] - point_a[1], point_c[2] - point_a[2]]
    i = AB[1] * AC[2] - AB[2] * AC[1]
    k = AB[2] * AC[0] - AB[0] * AC[2]
    j = AB[0] * AC[1] - AC[0] * AB[1]

    d = i * (-point_a[0]) + k * (-point_a[1]) + j * (-point_a[2])

    num = [-d, i, k, j]
    return num


def line(point_a, point_b):
    AB = [point_b[0] - point_a[0], point_b[1] - point_a[1], point_b[2] - point_a[2]]
    if AB[0] != 0:
        if point_a[0] < point_b[0]:
            x = rand.randint(point_a[0], point_b[0])
            if x == 0:
                x = 1
        else:
            x = rand.randint(point_b[0], point_a[0])
            if x == 0:
                x = 1
        t = (x - point_a[0]) / AB[0]
        y = point_a[1] + AB[1] * t
        z = point_a[2] + AB[2] * t
    else:
        if AB[1] != 0:
            if point_a[1] < point_b[1]:
                y = rand.randint(point_a[1], point_b[1])
                if y == 0:
                    y = 1
            else:
                y = rand.randint(point_b[1], point_a[1])
            t = (y - point_a[1]) / AB[1]
            x = point_a[0] + AB[0] * t
            z = point_a[2] + AB[2] * t
        else:
            if point_a[2] < point_b[2]:
                z = rand.randint(point_a[2], point_b[2])
                if z == 0:
                    z = 1
            else:
                z = rand.randint(point_b[2], point_a[2])
                if z == 0:
                    z = 1
            t = (z - point_a[2]) / AB[2]
            x = point_a[0] + AB[0] * t
            y = point_a[1] + AB[1] * t
    return [0, -x, -y, -z]




np.set_printoptions(formatter={'all': lambda x: str(fractions.Fraction(x).limit_denominator())})


class Simplex(object):

    def __init__(self, source, task_num=1):
        if source is None:
            source = []
        self.m = len(source)
        self.n = len(source[1])
        self.task_num = task_num
        self.table = [[0] * (self.m + self.n - 1) for i in range(self.m)]
        self.basis = []

    def simple(self, source, sights_arr):
        for j in range(self.m):
            for k in range(len(self.table[0])):
                if k < self.n:
                    self.table[j][k] = source[j][k]
                else:
                    self.table[j][k] = 0
            if (self.n + j) < len(self.table[0]):
                if not sights_arr[j]:
                    self.table[j][self.n + j] = 1
                else:
                    for l in range(self.n + j):
                        self.table[j][l] = -self.table[j][l]
                    self.table[j][self.n + j] = 1
                self.basis.append(self.n + j)
        self.n = len(self.table[0])

        result = []
        for i in range(len(self.basis)):
            result.append([self.basis[i]])
        result.append([-1])

        result = np.append(result, self.table, axis=1)

    def calculate(self):
        iteration_num = 1
        while not self.is_it_end():

            main_element = self.find_main_element()
            self.basis[main_element[0]] = main_element[1]

            new_table = [[0] * (self.n) for i in range(self.m)]

            for k in range(self.n):
                new_table[main_element[0]][k] = self.table[main_element[0]][k] / self.table[main_element[0]][
                    main_element[1]]

            for k in range(self.m):
                if k == main_element[0]:
                    continue

                for j in range(self.n):
                    new_table[k][j] = float(self.table[k][j]) - float(
                        self.table[k][main_element[1]] * new_table[main_element[0]][j])
            self.table = new_table
            iteration_num += 1
        result = [0, 0, 0]
        for k in range(self.n - self.m):
            if (k + 1) in self.basis:
                result[k] = round(self.table[self.basis.index(k + 1)][0], 6)
            else:
                result[k] = 0
        return result

    def is_it_end(self):
        for i in range(1, self.n):
            if self.table[self.m - 1][i] < 0:
                return False
        for i in range(self.m - 1):
            if self.table[i][0] < 0:
                return False
        return True

    def find_main_element(self):
        row = self.find_main_row()
        if row != -1:
            column = self.find_main_column_row(row)
            return [row, column]
        else:
            column = self.find_main_column()
            return self.find_main_row_column(column), column

    def find_main_row(self):
        main_row = -1
        for i in range(self.m - 1):
            if self.table[i][0] < 0:
                main_row = i
                break
        for i in range(main_row + 1, self.m - 1):
            if self.table[i][0] < 0:
                if main_row == -1 or (self.table[i][0] / self.table[i][0]) < (
                        self.table[main_row][0] / self.table[main_row][0]):
                    main_row = i
        return main_row

    def find_main_column(self):
        main_column = 1
        for i in range(2, self.n):
            if self.table[self.m - 1][i] < self.table[self.m - 1][main_column]:
                main_column = i
        return main_column

    def find_main_row_column(self, main_column):
        main_row = 1
        for i in range(self.m - 1):
            if self.table[i][main_column] > 0:
                main_row = i
                break
        for i in range(main_row + 1, self.m - 1):
            if self.table[i][main_column] > 0:
                if main_row == -1 or (self.table[i][0] / self.table[i][main_column]) < (
                        self.table[main_row][0] / self.table[main_row][main_column]):
                    main_row = i
        return main_row

    def find_main_column_row(self, row):
        main_column = 1
        for i in range(2, self.n):
            if self.table[row][i] < self.table[row][main_column]:
                main_column = i
        return main_column
