#!/bin/sh
set -eu
cd "$(dirname "$0")"

if [ -z "${WILDFLY_HOME:-}" ]; then
    echo "Задайте WILDFLY_HOME — каталог установленного WildFly." >&2
    exit 2
fi

PORTBASE=${PORTBASE:-24000}
case "$PORTBASE" in ''|*[!0-9]*)
    echo "PORTBASE должен быть числом от 1024 до 65534." >&2
    exit 2
    ;;
esac
if [ "$PORTBASE" -lt 1024 ] || [ "$PORTBASE" -gt 65534 ]; then
    echo "PORTBASE должен быть числом от 1024 до 65534." >&2
    exit 2
fi

HTTP_PORT=$PORTBASE
MANAGEMENT_PORT=$((PORTBASE + 1))

mvn -q package
deployments="$WILDFLY_HOME/standalone/deployments"
mkdir -p "$deployments"
cp target/area-check.war "$deployments/.area-check.war.tmp"
mv "$deployments/.area-check.war.tmp" "$deployments/area-check.war"

echo "Запускаю WildFly standalone: HTTP :$HTTP_PORT, management localhost:$MANAGEMENT_PORT"
exec "$WILDFLY_HOME/bin/standalone.sh" \
    --server-config=standalone.xml \
    -b=0.0.0.0 \
    -bmanagement=127.0.0.1 \
    "-Djboss.http.port=$HTTP_PORT" \
    "-Djboss.management.http.port=$MANAGEMENT_PORT"
