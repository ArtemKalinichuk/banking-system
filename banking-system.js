class UniqueNumberGenerator {
	#accountSequence;
	constructor(prefix = "ACC") {
		this.#accountSequence = 1;
		this.prefix = prefix;
	}
	generateAccountNumber() {
		// Always generates unique account number
		const accountNumber = `${this.prefix}${this.#accountSequence
			.toString()
			.padStart(7, "0")}`;
		this.#accountSequence++;
		return accountNumber;
	}
}

class Customer {
	constructor(name, address) {
		this.name = name;
		this.address = address;
	}

	getName() {
		return this.name;
	}
}

class BankAccount {
	constructor(customer, accountNumber) {
		this.customer = customer;
		this.accountNumber = accountNumber;
		this.balance = 0;
		this.isOpened = true;
	}

	deposit(amount) {
		if (!this.isOpened) {
			throw new Error(
				"Account is closed. You cannot perform operations on a closed account"
			);
		}
		if (Number.isInteger(amount) && amount > 0) {
			this.balance += amount;
			this.notifyCustomer("deposit", amount);
		}
	}

	withdraw(amount) {
		if (this.checkValidAmount(amount)) {
			this.balance -= amount;
			this.notifyCustomer("withdraw", amount);
		}
	}

	transfer(amount, recipient) {
		if (this.checkValidAmount(amount)) {
			const recipientAccount = bank.getCustomerAccountByName(recipient);
			if (recipientAccount) {
				this.balance -= amount;
				recipientAccount.balance += amount;
				this.notifyCustomer("transfer", amount, recipientAccount);
			}
		}
	}

	notifyCustomer(operation, amount, recipient = null) {
		const customerName = this.customer.getName();
		const recipientName = recipient ? recipient.customer.getName() : null;
		const balance = this.getBalance();
		if (!recipient) {
			console.log(
				`${customerName}, you've successfully ${operation}ed ${amount}$. Now your balance is ${balance}$.`
			);
		} else {
			console.log(
				`${customerName}, you've successfully ${operation} ${amount}$ to ${recipientName}. Now your balance is ${balance}$.`
			);
		}
	}

	getBalance() {
		return this.balance;
	}

	checkValidAmount(amount) {
		if (!this.isOpened) {
			throw new Error(
				"Account is closed. You cannot perform operations on a closed account"
			);
		}
		if (Number.isInteger(amount) && amount > 0 && amount <= this.balance) {
			return true;
		} else {
			throw new Error(
				"Invalid amount. Please provide a positive integer value, greater that your balance."
			);
		}
	}
}

class Bank {
	constructor(bankAccountPrefix = "ACC") {
		this.customerAccounts = {};
		this.bankAccountPrefix = bankAccountPrefix;
		this.numberGenerator = new UniqueNumberGenerator(bankAccountPrefix);
	}

	openAccount(customer) {
		if (customer instanceof Customer) {
			const accountNumber = this.numberGenerator.generateAccountNumber();
			const account = new BankAccount(customer, accountNumber);
			this.customerAccounts[accountNumber] = account;
			return account;
		} else {
			throw new Error(
				"Invalid argument: The customer parameter must be an instance of the Customer class."
			);
		}
	}

	closeAccount(customer) {
		const account = this.getCustomerAccountByName(customer);
		if (account) {
			account.isOpened = false;
		}
	}
	reOpenAccount(customer) {
		const account = this.getCustomerAccountByName(customer);
		if (account) {
			account.isOpened = true;
		}
	}

	getTotalBalance() {
		let totalBalance = 0;
		for (const accountNumber in this.customerAccounts) {
			const account = this.customerAccounts[accountNumber];
			totalBalance += account.getBalance();
		}
		return totalBalance;
	}
	getAllCustomers() {
		return this.customerAccounts;
	}

	getCustomerAccountByName(customer) {
		// returns customer's account if exists, else - false
		if (customer instanceof Customer) {
			for (const accountNumber in this.customerAccounts) {
				const account = this.customerAccounts[accountNumber];
				if (account.customer === customer) {
					return account;
				}
			}
		}
		return false;
	}
	getCustomerAccountByNumber(accountNumber) {
		// returns customer's account if exists, else - false
		if (accountNumber.substring(0, 3) === this.bankAccountPrefix) {
			for (const _accountNumber in this.customerAccounts) {
				const account = this.customerAccounts[_accountNumber];
				if (account.accountNumber === accountNumber) {
					return account;
				}
			}
		}
		return false;
	}
}

// Tests

const bank = new Bank();

const artem = new Customer("Artem", "Example Str");
const robert = new Customer("Robert", "Example Str2");

const account1 = bank.openAccount(artem);
const account2 = bank.openAccount(robert);

account1.deposit(23);
account1.withdraw(15);

account1.transfer(5, robert);
bank.closeAccount(artem);
try {
	account1.deposit(100);
} catch {
	console.log(
		`Couldn't deposit on ${account1.customer.getName()}'s account.`
	);
}
bank.reOpenAccount(artem);
account1.deposit(100);
console.log(`Bank's total balance is: ${bank.getTotalBalance()}$`);

console.log(bank.getCustomerAccountByNumber("ACC0000001"));
