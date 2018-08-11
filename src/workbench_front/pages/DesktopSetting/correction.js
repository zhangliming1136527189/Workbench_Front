/**
 * 防止元素溢出容器
 * @param {Int} gridX
 * @param {Int} gridY 
 * @param {Int} col
 * @param {Int} w 卡片宽度
 * @returns {Object} gridX，gridY的单元格坐标对象
 */
export const checkInContainer = (gridX, gridY, col, w) => {
	if (gridX + w > col - 1) gridX = col - w; //右边界
	if (gridX < 0) gridX = 0; //左边界
	if (gridY < 0) gridY = 0; //上边界
	return { gridX, gridY };
};
