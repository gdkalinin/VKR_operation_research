import numpy as np
import matplotlib.pyplot as plt
import fractions
import matplotlib.patches as mpatches
import pylab


def graph(result_arr=None, points_arr=None, sol_num=0, result=None):
    if result is None:
        result = []
    if points_arr is None:
        points_arr = []
    if result_arr is None:
        result_arr = []
    xr = np.linspace(-5, 30, 2)
    vector = np.linspace(0, 10, 2)
    plt.close()
    for i in range(len(points_arr[0])):
        plt.plot(points_arr[0][i], points_arr[1][i], "go", markersize=10)

    for i in range(len(result_arr) - 1):
        if result_arr[i][1] == 0:
            plt.axhline(result_arr[i][0] / result_arr[i][2], color=np.random.rand(3, ),
                        label=u'Прямая ' + (
                            "-" if result_arr[i][1] == -1 else "" if result_arr[i][1] == 1 else "0" if
                            result_arr[i][1] == -0 else str(
                                fractions.Fraction(result_arr[i][1]).limit_denominator()))
                              + "x + " + ("-" if result_arr[i][2] == -1 else "" if result_arr[i][2] == 1 else
                        str(fractions.Fraction(result_arr[i][2]).limit_denominator()))
                              + "y =" + str(result_arr[i][0]) + "\n")
        else:
            if result_arr[i][2] == 0:
                plt.axvline(result_arr[i][0] / result_arr[i][1], color=np.random.rand(3, ),
                             label=u'Прямая ' + (
                                 "-" if result_arr[i][1] == -1 else "" if result_arr[i][1] == 1 else "0" if
                                 result_arr[i][1] == -0 else str(
                                     fractions.Fraction(result_arr[i][1]).limit_denominator()))
                                   + "x + " + ("-" if result_arr[i][2] == -1 else "" if result_arr[i][2] == 1 else
                             str(fractions.Fraction(result_arr[i][2]).limit_denominator()))
                                   + "y =" + str(result_arr[i][0]) + "\n")
            else:
                plt.plot(xr, -result_arr[i][1] / result_arr[i][2] * xr + result_arr[i][0] / result_arr[i][2],
                         color=np.random.rand(3, ), label=u'Прямая ' + ("-" if result_arr[i][1] == -1
                                                                        else "" if result_arr[i][1] == 1 else "0" if
                    result_arr[i][1] == -0 else str(
                        fractions.Fraction(result_arr[i][1]).limit_denominator())) + "x + " +
                                                          ("-" if result_arr[i][2] == -1 else "" if result_arr[
                                                                                                        2] == 1 else
                                                          str(fractions.Fraction(
                                                              result_arr[i][2]).limit_denominator()))
                                                          + "y =" + str(result_arr[i][0]) + "\n")

    line1, = plt.plot(xr, -result_arr[len(result_arr) - 1][1] / result_arr[len(result_arr) - 1][2] * xr , color="red", linestyle="dashdot",
            label=u'Целевая функция')
    line2, = plt.plot(vector, result_arr[len(result_arr) - 1][2] / result_arr[len(result_arr) - 1][1] * vector, color="black",
            linestyle="dashed",
            label=u'Вектор-направление')
    plt.fill(points_arr[0], points_arr[1], 'red', alpha=0.5)
    plt.xlim(-5, 18)
    plt.ylim(-10, 18)
    plt.xlabel(u'Ось Х')
    plt.ylabel(u'Ось У')

    # Create a legend for the first line.

    red_patch = mpatches.Patch(color='red', alpha=0.5,  label='Область, принадлежащая системе уравнений')
    first_legend = plt.legend(handles=[red_patch], bbox_to_anchor=(0., 1.02, 1., .102), loc='lower left',
                              borderaxespad=0.)

    # Add the legend manually to the current Axes.
    ax = plt.gca().add_artist(first_legend)
    plt.legend(fontsize=8,
              ncol=2,
              facecolor='oldlace',
              edgecolor='r',
              title='Прямые',
              title_fontsize='5',
              loc="best")
    plt.savefig("results/solutions/sol" + str(sol_num) + "/task.pdf")

    line1.remove()
    line2.remove()
    plt.plot(xr, -result_arr[len(result_arr) - 1][1] / result_arr[len(result_arr) - 1][2] * xr + (result[0] * result_arr[len(result_arr) - 1][1] + result[1] * result_arr[len(result_arr) - 1][2])/result_arr[len(result_arr) - 1][2], color="red", linestyle='dotted',
             label=u'Оптимальный путь')
    plt.legend(fontsize=8,
               ncol=2,
               facecolor='oldlace',
               edgecolor='r',
               title='Прямые',
               title_fontsize='5',
               loc="best")
    arrowprops = {
        'arrowstyle': '->',
    }

    # !!! Добавление аннотации
    pylab.annotate(u'Точка экстремума!',
                   xy=(result[0], result[1]),
                   xytext=(result[0] + 2, result[1] + 2),
                   arrowprops=dict(facecolor='black', shrink=0.05))
    plt.savefig("results/solutions/sol" + str(sol_num) + "/result.pdf")
