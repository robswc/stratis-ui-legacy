export const getHexFromClass = (className: string): string => {
    const element = document.createElement('div');
    element.classList.add(className);
    document.body.appendChild(element);
    const backgroundColor = getComputedStyle(element).backgroundColor;
    document.body.removeChild(element);
    return backgroundColor;
};

export const getMoneyFormat = (value: number): string => {
    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
}

export const getOrderTypeAbbreviation = (orderType: string): string => {
    if (orderType === 'market') {
        return 'MKT';
    } else if (orderType === 'limit') {
        return 'LMT';
    } else if (orderType === 'stop') {
        return 'STP';
    } else if (orderType === 'stop_limit') {
        return 'STP LMT';
    }
    return '';
}