
// Note this is a mock service to be used in place of API calls to the American Express API to retrieve this info
class AmexService {
    getBankingInfo = () => {
        // Mocked banking info - in a production solution this would need to be done through an API call
        return `
            Savings Account Balance: $1,337.00
            Chequing Account Balance: $666.66
            Savings Account Interest Rate: 2.5%
        `;
    }

    getCreditCardInfo = () => {
        // Mocked CC info - in a production solution this would need to be done through an API call
        return `
            Credit Card Type: Platinum Business Card
            Interest Rate: 8%
            Statement balance: $1,337.00
            Next payment due date: May 23, 2023
            Current minimum payment: $10.00
        `;
    }

    getMortgageInfo = () => {
        // Mocked mortgage info - in a production solution this would need to be done through an API call
        return `
            Outstanding Principal Balance: $346,264.73
            Interest Rate: 4.25%
            Loan Maturity Date: June 20, 2053
            Next Payment Due Date: May 23, 2023
            Next Payment Amount Due: $2,216.52
        `;
    }
}

export { AmexService };