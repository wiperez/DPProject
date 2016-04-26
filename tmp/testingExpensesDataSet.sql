select Account.AccountId,Account.AccountCode,
  Account.ParentAccount,Account.AccountName,
  Account.AccountDescription,JournalOperation.PeriodId,
  JournalOperation.Id AS OperationId,ISNULL(JournalOperation.Amount, 0) AS Amount
from Account left join JournalOperation 
  on Account.AccountId = JournalOperation.AccountId
where Account.ParentAccount=4