#!/bin/sh
set -e

CERT=/etc/nginx/certs/cert.pem
KEY=/etc/nginx/certs/key.pem

mkdir -p /etc/nginx/certs

if [ ! -f "$CERT" ] || [ ! -f "$KEY" ]; then
  echo "[nginx] Generating self-signed certificate for taskmanager.test..."
  openssl req -x509 -nodes -days 3650 -newkey rsa:2048 \
    -keyout "$KEY" \
    -out "$CERT" \
    -config /etc/nginx/openssl.cnf
  echo "[nginx] Certificate generated."
fi

exec nginx -g 'daemon off;'
