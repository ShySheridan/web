<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Проверка попадания точки</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/index.css">
    <script defer src="${pageContext.request.contextPath}/assets/js/index.js"></script>
</head>
<body>
<header>
    <h1>Проверка попадания точки</h1>
    <p>Амина Умарова · Группа P3217 · Вариант 49384</p>
</header>
<main>
    <div class="layout">
        <section class="panel">
            <h2>Координатная плоскость</h2>
            <canvas id="graph" width="420" height="420" aria-label="График области; нажмите, чтобы проверить точку"></canvas>
<%--            <p>Нажмите на график, чтобы выбрать точку. Для X используются целые значения от −4 до 4.</p>--%>
        </section>
        <section class="panel">
            <h2>Координаты точки</h2>
            <form id="point-form" action="${pageContext.request.contextPath}/controller" method="post">
                <div class="field">
                    <label for="x">Координата X</label>
                    <select id="x" name="x" required>
                        <option value="-4" ${xValue == '-4' ? 'selected' : ''}>-4</option>
                        <option value="-3" ${xValue == '-3' ? 'selected' : ''}>-3</option>
                        <option value="-2" ${xValue == '-2' ? 'selected' : ''}>-2</option>
                        <option value="-1" ${xValue == '-1' ? 'selected' : ''}>-1</option>
                        <option value="0" ${xValue == null || xValue == '0' ? 'selected' : ''}>0</option>
                        <option value="1" ${xValue == '1' ? 'selected' : ''}>1</option>
                        <option value="2" ${xValue == '2' ? 'selected' : ''}>2</option>
                        <option value="3" ${xValue == '3' ? 'selected' : ''}>3</option>
                        <option value="4" ${xValue == '4' ? 'selected' : ''}>4</option>
                    </select>
                </div>
                <div class="field">
                    <label for="y">Координата Y</label>
                    <input id="y" name="y" type="text" inputmode="decimal" required value="<c:out value='${yValue}' default='0'/>"
                           placeholder="От −3 до 3" aria-describedby="y-range">
                    <small id="y-range">−3 ≤ Y ≤ 3</small>
                </div>
                <fieldset>
                    <legend>Радиус R</legend>
                    <div class="r-options">
                        <label><input type="checkbox" name="r" value="1" ${rValue == '1' ? 'checked' : ''}> 1</label>
                        <label><input type="checkbox" name="r" value="2" ${rValue == '2' ? 'checked' : ''}> 2</label>
                        <label><input type="checkbox" name="r" value="3" ${rValue == null || rValue == '3' ? 'checked' : ''}> 3</label>
                        <label><input type="checkbox" name="r" value="4" ${rValue == '4' ? 'checked' : ''}> 4</label>
                        <label><input type="checkbox" name="r" value="5" ${rValue == '5' ? 'checked' : ''}> 5</label>
                    </div>
                </fieldset>
                <button id="submit-button" type="submit">Проверить</button>
                <p class="error" role="alert"><c:out value="${errorMessage}"/></p>
            </form>
        </section>
    </div>
    <section class="panel">
        <h2>Результаты проверок</h2>
        <div class="table-scroll">
            <table>
                <thead><tr><th>X</th><th>Y</th><th>R</th><th>Результат</th><th>Дата и время</th><th>Обработка, мкс</th></tr></thead>
                <tbody>
                <c:forEach items="${checkPointHistory.results}" var="row">
                    <tr class="saved-point" data-x="${row.x}" data-y="${row.y}" data-r="${row.r}" data-hit="${row.hit}">
                        <td><c:out value="${row.x}"/></td><td><c:out value="${row.y}"/></td><td><c:out value="${row.r}"/></td>
                        <td class="${row.hit ? 'hit' : 'miss'}"><c:out value="${row.hit ? 'Попадание' : 'Промах'}"/></td>
                        <td><c:out value="${row.timestamp}"/></td><td><c:out value="${row.elapsedNanos / 1000}"/></td>
                    </tr>
                </c:forEach>
                <c:if test="${empty checkPointHistory.results}"><tr><td colspan="6" class="empty">Проверок пока нет</td></tr></c:if>
                </tbody>
            </table>
        </div>
    </section>
</main>
</body>
</html>
