#!/usr/bin/env bash
# =============================================================
#  deploy.sh — Portafolio baezjimenez.com
#  Uso: bash deploy.sh
#  Requiere: AWS CLI configurado (aws configure)
# =============================================================

set -e  # Detener si cualquier comando falla

BUCKET="baezjimenez.com"
DISTRIBUTION_ID="E1I687WSVV0R18"

echo "🚀 Iniciando deployment a s3://$BUCKET"
echo ""

# ------------------------------------------------------------------
# 1. Sincronizar archivos locales → S3
#    Excluye archivos de desarrollo que no deben ir al servidor
# ------------------------------------------------------------------
echo "📤 Subiendo archivos..."

aws s3 sync . "s3://$BUCKET" \
  --exclude ".git/*" \
  --exclude "*.md" \
  --exclude ".gitignore" \
  --exclude ".prettierrc" \
  --exclude "deploy.sh" \
  --exclude "cloudfront-security-headers.js" \
  --exclude "*.jsonl" \
  --delete

echo "✅ Archivos sincronizados"
echo ""

# ------------------------------------------------------------------
# 2. Invalidar caché de CloudFront
#    Fuerza que los edge locations sirvan los archivos nuevos
# ------------------------------------------------------------------
echo "🔄 Invalidando caché de CloudFront (distribución $DISTRIBUTION_ID)..."

aws cloudfront create-invalidation \
  --distribution-id "$DISTRIBUTION_ID" \
  --paths "/*"

echo ""
echo "✅ Invalidación creada. Los cambios serán visibles en ~30–60 segundos."
echo ""
echo "🌐 Sitio: https://$BUCKET"
