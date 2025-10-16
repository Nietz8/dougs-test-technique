# 🏦 Dougs Bank Reconciliation API

API de validation d'intégrité des synchronisations bancaires.

## 📋 Contexte

Dougs récupère les opérations bancaires via scraping. Cette API valide l'intégrité en détectant :

- ✅ Doublons d'opérations
- ✅ Opérations manquantes

## 🚀 Démarrage Rapide

```bash
# Installation
yarn install

# Démarrage
yarn start:dev

# Tests
yarn test
```

**Application** : http://localhost:3000
**Documentation Swagger** : http://localhost:3000/api/v1

## 📖 API

### POST `/movements/validation`

Valide une réconciliation bancaire.

**Request:**

```json
{
  "movements": [
    { "id": 1, "date": "2025-03-01", "wording": "DEPOT", "amount": 500 }
  ],
  "balances": [
    { "date": "2025-02-28", "balance": 1500 },
    { "date": "2025-03-31", "balance": 2000 }
  ]
}
```

**Response (200 OK):**

```json
{
  "isValid": true,
  "reasons": [
    {
      "executionDate": "2025-01-22T15:00:00.000Z",
      "period": {
        "startDate": "2025-01-02",
        "endDate": "2025-01-18"
      },
      "message": "ACCEPTED"
    }
  ]
}
```

## 🎯 Fonctionnalités Clés

### Détection des Doublons

Identifie les opérations identiques et suggère leur suppression.

### Validation des Soldes

Compare les soldes attendus vs réels période par période.

### Suggestions Actionnables

Fournit des recommandations précises pour corriger les anomalies.

## 📊 Exemple de Réponse Détaillée

```json
{
  "isValid": false,
  "reasons": [
    {
      "executionDate": "2025-01-22T15:00:00.000Z",
      "period": {
        "startDate": "2025-01-02",
        "endDate": "2025-01-18"
      },
      "message": "VALIDATION FAILED",
      "code": "MISSING_OPERATION",
      "summary": "Balance mismatch detected between 2025-01-03 and 2025-01-16. Expected variation: 2500.00, Actual: 2200.00, Difference: 300.00",
      "numberOfDuplicates": 3,
      "duplicatedIds": [5],
      "duplicatedOperation": [
        {
          "id": 5,
          "date": "2025-01-07",
          "wording": "ABONNEMENT TELEPHONE",
          "amount": 100
        }
      ],
      "statementsBalance": 2500,
      "operationsBalance": 2200,
      "gap": 300
    }
  ]
}
```

## 🧪 Tests

```bash
yarn test         # Units tests
yarn test:cov     # Test coverage
yarn run test:e2e # e2e test
```

## 📝 Documentation Complète

Consultez la documentation Swagger interactive : **http://localhost:3000/api/v1**

## 🔒 Codes HTTP

- **200 OK** : Validation exécutée (voir `isValid`)
- **400 BAD REQUEST** : Requête malformée
- **500 ERROR** : Erreur serveur
