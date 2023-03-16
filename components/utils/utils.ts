export const getHexFromClass = (className: string): string => {
    const element = document.createElement('div');
    element.classList.add(className);
    document.body.appendChild(element);
    const backgroundColor = getComputedStyle(element).backgroundColor;
    document.body.removeChild(element);
    return backgroundColor;
};