<%@ page contentType="text/html; charset=UTF-8" pageEncoding="UTF-8" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!doctype html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Результат проверки</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/assets/css/result.css">
    <script defer src="${pageContext.request.contextPath}/assets/js/result.js"></script>
</head>
<body>
<header><h1>Результат проверки точки</h1></header>
<main>
    <section>
        <h2>Параметры запроса</h2>
        <table>
            <tbody>
                <tr><th>X</th><td><c:out value="${result.x}"/></td></tr>
                <tr><th>Y</th><td><c:out value="${result.y}"/></td></tr>
                <tr><th>R</th><td><c:out value="${result.r}"/></td></tr>
                <tr><th>Результат</th><td class="${result.hit ? 'hit' : 'miss'}"><c:out value="${result.hit ? 'Попадание' : 'Промах'}"/></td></tr>
            </tbody>
        </table>
        <h2>Точка на графике</h2>
        <canvas id="result-graph" width="420" height="420"
                data-r="<c:out value='${result.r}'/>"
                data-x="<c:out value='${result.x}'/>"
                data-y="<c:out value='${result.y}'/>"
                data-hit="<c:out value='${result.hit}'/>"
                aria-label="Проверенная точка на графике"></canvas>
        <p>Проверка сохранена в истории текущей сессии.</p>
        <a class="back-link" href="${pageContext.request.contextPath}/controller">Вернуться к форме</a>
    </section>
</main>
</body>
</html>
