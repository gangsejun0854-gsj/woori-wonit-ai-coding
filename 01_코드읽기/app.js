
const accounts = [
	{ accountId: 1, accountNo: "1002-345-678901", accountType: "입출금", balance: 1523000, status: "정상", ownerName: "김연지" },
	{ accountId: 2, accountNo: "1002-345-112233", accountType: "적금", balance: 1200000, status: "정상", ownerName: "김연지" },
	{ accountId: 3, accountNo: "1002-345-998877", accountType: "청약", balance: 397000, status: "휴면", ownerName: "김연지" }
];

const transactions = [
	{ txId: 10, txType: "출금", amount: 45000, category: "쇼핑", memo: "온라인쇼핑몰 결제", counterparty: "쿠팡", txDatetime: "2026-08-25T18:42:00" },
	{ txId: 9, txType: "출금", amount: 12000, category: "식비", memo: "점심 식사", counterparty: "김밥천국", txDatetime: "2026-08-25T12:15:00" },
	{ txId: 8, txType: "입금", amount: 3200000, category: "급여", memo: "8월 급여", counterparty: "(주)원아이티", txDatetime: "2026-08-25T09:00:00" },
	{ txId: 7, txType: "출금", amount: 55000, category: "통신", memo: "휴대폰 요금", counterparty: "SK텔레콤", txDatetime: "2026-08-24T10:20:00" },
	{ txId: 6, txType: "출금", amount: 1800, category: "교통", memo: "버스 이용", counterparty: "서울교통공사", txDatetime: "2026-08-23T08:05:00" },
	{ txId: 5, txType: "출금", amount: 89000, category: "의료", memo: "치과 진료비", counterparty: "미소치과", txDatetime: "2026-08-22T15:30:00" },
	{ txId: 4, txType: "출금", amount: 320000, category: "이체", memo: "월세 이체", counterparty: "박집주인", txDatetime: "2026-08-21T09:10:00" },
	{ txId: 3, txType: "출금", amount: 68000, category: "쇼핑", memo: "생필품 구매", counterparty: "이마트", txDatetime: "2026-08-20T19:45:00" },
	{ txId: 2, txType: "입금", amount: 150000, category: "이체", memo: "용돈 받음", counterparty: "김엄마", txDatetime: "2026-08-19T11:00:00" },
	{ txId: 1, txType: "출금", amount: 4500, category: "식비", memo: "카페", counterparty: "스타벅스", txDatetime: "2026-08-18T08:30:00" }
];

// 숫자를 한국 원화 형식의 문자열로 변환합니다.
function formatCurrency(amount) {
	return amount.toLocaleString("ko-KR") + "원";
}

// 계좌번호 가운데 일부를 마스킹합니다.
function maskAccountNumber(accountNumber) {
	const accountParts = accountNumber.split("-");
	const maskedLastPart = accountParts[2].slice(0, 1) + "****" + accountParts[2].slice(-1);

	return accountParts[0] + "-" + accountParts[1] + "-" + maskedLastPart;
}

// 출금 거래만 골라 카테고리별 금액을 합산합니다.
function calculateWithdrawalByCategory(transactionList) {
	return transactionList.reduce((categoryTotals, transaction) => {
		if (transaction.txType === "출금") {
			categoryTotals[transaction.category] = (categoryTotals[transaction.category] || 0) + transaction.amount;
		}

		return categoryTotals;
	}, {});
}

// 거래 유형이 전체면 모든 거래를, 아니면 해당 유형의 거래만 반환합니다.
function filterTransactions(transactionList, transactionType) {
	return transactionType === "전체"
		? transactionList
		: transactionList.filter(transaction => transaction.txType === transactionType);
}

const selectElement = selector => document.querySelector(selector);

selectElement("#acc").innerHTML = "<h2>계좌 목록</h2>" + accounts.map(account => `
	<div class="row">
		<b>${account.ownerName}</b> · ${account.accountType} · ${maskAccountNumber(account.accountNo)}<br>
		${formatCurrency(account.balance)} <span class="${account.status === "정상" ? "ok" : "bad"}">${account.status}</span>
	</div>
`).join("");

const withdrawalByCategory = calculateWithdrawalByCategory(transactions);
selectElement("#cat").innerHTML = "<h2>카테고리별 출금 합계</h2>" + Object.keys(withdrawalByCategory).map(category => `
	<div class="row">${category} : ${formatCurrency(withdrawalByCategory[category])}</div>
`).join("");

const allTransactions = filterTransactions(transactions, "전체");
selectElement("#tx").innerHTML = "<h2>전체 거래내역</h2>" + allTransactions.map(transaction => `
	<div class="row">
		${transaction.txDatetime.slice(0, 10)} · ${transaction.memo}<br>
		<span class="${transaction.txType === "입금" ? "ok" : "bad"}">${transaction.txType === "입금" ? "+" : "-"}${formatCurrency(transaction.amount)}</span>
	</div>
`).join("");

// formatCurrency의 기본 동작을 확인합니다.
console.assert(formatCurrency(1523000) === "1,523,000원", "formatCurrency 테스트 실패");
