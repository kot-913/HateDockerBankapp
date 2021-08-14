export const accountNumber = () => {
    let accountNumber = '';
    for (let i = 0; i < 4; i++) {
      accountNumber += `${Math.floor(1000 + Math.random() * 9000)} `;
    }
    return accountNumber.trim();
  }
