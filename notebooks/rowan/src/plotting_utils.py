"""Utility class for plotting.

Date: 2023-10-20 (modified 2023-10-20)
"""
from typing import Dict

import matplotlib.pyplot as plt
import matplotlib.patches as mpatches
import seaborn as sns

def dict_to_bar_chart(
    data_dc: Dict[str, float],
    title: str,
    x_label: str,
    y_label: str,
    save_path: str,
    palette: str = "husl",
    max_score: int = 10,
) -> None:
    """Create a bar chart from a dictionary of [str: float].

    Args:
        data_dc     : The dictionary of data to plot
        title       : The title for the plot
        x_label     : The label for the x-axis
        y_label     : The label for hte y-axis
        save_path   : The path to which to save the figure
        palette     : The palette to use, e.g. 'husl', 'terrain', etc.
        max_score   : The maximum score for the plot (y-axis limit)
    """
    # Plot data
    sns.set_style("whitegrid")
    palette = sns.color_palette(palette, len(data_dc))
    plt.figure(figsize=(16, 8))

    # Create a color bar for each competency to use in the legend
    color_bars = []
    for competency, color in zip(data_dc.keys(), palette):
        color_bar = mpatches.Patch(color=color, label=competency)
        color_bars.append(color_bar)

    # Plot the bar chart
    sns.barplot(
        x=list(data_dc.keys()),
        y=list(data_dc.values()),
        hue=list(data_dc.keys()),
        dodge=False,
        palette=palette,
        legend=False
    )

    # Add the value of each bar in text right above the bar
    values = list(data_dc.values())
    for i in range(len(values)):
        plt.annotate(
            str(values[i]),
            xy=(i, values[i] + 0.2),
            ha="center",
            va="center"
        )

    # Set properties
    plt.title(title, fontsize=16)
    plt.xlabel(x_label, fontsize=14)
    plt.ylabel(y_label, fontsize=14)
    plt.ylim(0, max_score)
    plt.xticks([])
    plt.grid(color='gray', linestyle='-', linewidth=0.5, alpha=0.5)
    #plt.yticks(range(max_score + 1))

    # Add the color bars to the legend
    plt.legend(
        title=title,
        handles=color_bars,
        labels=list(data_dc.keys()),
        fontsize=12,
        bbox_to_anchor=(1.05, 1),
        loc='upper left',
    )

    # Save
    plt.tight_layout()
    plt.savefig(save_path)


if __name__ == "__main__":
    data_dc = {
        "Solving Equations": 9.5, 
        "Solving Inequalities": 5.2,
        "Linear Functions": 8.3,
        "Systems of Equations and Inequalities": 4.2,
        "Exponents and Exponential Functions": 8.8,
        "Radical Expressions and Equations": 6.4,
        "Quadratic Functions": 3.2,
        "Data Analysis and Probability": 9.2
    }
    title = "Competency Analysis"
    x_label = "Competency"
    y_label = "Score"
    save_path = "/Users/wingr-judieai/Desktop/competency_plot.png"

    dict_to_bar_chart(data_dc, title, x_label, y_label, save_path)

