window.CLOUD_SA_DATA = {
  updatedAt: '2026-09-29',
  completedDays: 10,
  currentTrack: 'Database / RDS',
  scores: [
    {day:1, score:72},{day:2, score:84},{day:3, score:88},{day:4, score:87},{day:5, score:81},{day:6, score:83},{day:7, score:86},{day:8, score:94},{day:9, score:92},{day:10, score:91}
  ],
  roadmap: [
    'Architecture','Networking','IAM / Security','Compute','Storage','Database','High Availability','DR','Migration','Modernization','Terraform','Docker','Kubernetes','CI/CD','Observability','FinOps','GenAI / Bedrock','GCP 對照'
  ],
  skillMap: {
    summary: [
      {label:'完成訓練', value:'Day 1–10'},
      {label:'目前主題', value:'Database / RDS'},
      {label:'已建立基礎', value:'5 大領域'},
      {label:'下一階段', value:'Database / HA'}
    ],
    domains: [
      {
        name:'Architecture', status:'stable', statusLabel:'基礎已建立',
        items:['Requirement / Constraint / Trade-off','Failure Mode 思考','High Availability 基本概念','RTO / RPO 基礎判斷','Multi-AZ vs Multi-Region','Security / Reliability / Cost 平衡']
      },
      {
        name:'Networking', status:'stable', statusLabel:'掌握度穩定',
        items:['VPC','Public / Private Subnet','Internet Gateway','NAT Gateway','Security Group','NACL','ALB / WAF 基本角色','Private App / DB Network Pattern']
      },
      {
        name:'IAM / Security', status:'strengthen', statusLabel:'持續強化',
        items:['IAM User / Role / Policy','Temporary Credentials','Least Privilege','sts:AssumeRole','Trust Policy','Permission Policy','Explicit Deny','AWS Organizations / SCP 基礎','CloudTrail Audit']
      },
      {
        name:'Compute', status:'stable', statusLabel:'掌握度穩定',
        items:['EC2','Application Load Balancer','Auto Scaling Group','Launch Template','Replacement vs Scale Out','Min / Desired / Max Capacity','CPUUtilization','RequestCountPerTarget','Instance Warm-up','Scheduled Scaling']
      },
      {
        name:'Storage / S3', status:'current', statusLabel:'目前學習中',
        items:['S3 Object Storage','Bucket / Object / Key','Versioning','Lifecycle Policy','S3 Standard','Standard-IA','Glacier 基礎','SSE-KMS','S3 IAM Object ARN','CloudTrail S3 Data Events','Object Lock / WORM','Compliance vs Governance','Cross-Region Replication','RTO / RPO 基礎','S3 RTC 與 SLA 思維']
      },
      {
        name:'下一階段', status:'next', statusLabel:'接下來',
        items:['RDS / Aurora','Multi-AZ / Read Replica 深化','RDS Backup / PITR','Backup / Disaster Recovery 深化','Migration / Modernization']
      }
    ],
    mastered:['IGW / NAT Gateway','Public / Private Subnet','SG vs NACL','ALB / ASG / Launch Template','Replacement vs Scaling','Instance Warm-up','S3 Versioning','S3 Lifecycle','Least Privilege 基本思維','RTO vs RPO','S3 Object Lock Compliance','S3 CRR 非同步複寫'],
    confused:['Trust Policy vs Permission Policy','SCP vs IAM Permission','Authentication vs Authorization','ALB Health Check vs ASG Replacement','S3 ARN vs s3:// URI','CloudTrail vs S3 Data Events','Versioning vs Backup','S3 RTC 15 分鐘 SLA vs Business RPO 10 分鐘','Replication vs 完整 Backup'],
    upcoming:['Database 深入','RDS Multi-AZ / Read Replica','Backup / Disaster Recovery 深化','Migration','Modernization','Terraform','Docker / Kubernetes','CI/CD','Observability','FinOps','Bedrock / GenAI','GCP Architecture'],
    architectureFlow:['Internet','IGW','WAF','ALB','EC2 + ASG','RDS Multi-AZ','S3'],
    architectureCurrentIndex:6,
    thinkingFlow:['Requirement','Constraint','Failure Mode','Architecture','Security','Reliability','Cost','Trade-off']
  },
  practicalExamples: [
    {
      tag:'Networking + Compute + DB',
      title:'案例 1｜客戶查詢貸款餘額',
      subtitle:'從手機送出 Request，到資料庫回傳結果',
      description:'情境：客戶在網銀 App 點「查詢貸款餘額」。',
      steps:[
        {aws:'Internet / IGW',real:'客戶的 HTTPS Request 進入 AWS VPC'},
        {aws:'AWS WAF',real:'先擋惡意 IP、SQL Injection、異常 Request'},
        {aws:'ALB',real:'把正常流量分配到健康的 Loan API EC2'},
        {aws:'EC2 + ASG',real:'Loan API 執行查詢；流量高時可擴容'},
        {aws:'RDS Multi-AZ',real:'查詢貸款主檔；Primary 故障時可 Failover'}
      ],
      memory:'WAF 管「這個 Request 該不該進」；ALB 管「要送去哪台」；ASG 管「要有幾台」；RDS 管「資料」。'
    },
    {
      tag:'IAM / Security',
      title:'案例 2｜Production 半夜故障，工程師需要查資料',
      subtitle:'AssumeRole、Temporary Credentials 與 Audit',
      description:'情境：Arthur 平常沒有 Production Admin 權限，凌晨 Incident 需要查看 EC2、RDS、CloudWatch。',
      steps:[
        {aws:'Arthur Identity',real:'公司帳號 / Federated Identity'},
        {aws:'sts:AssumeRole',real:'提出切換到 ProdReadOnlyRole 的請求'},
        {aws:'Trust Policy + MFA',real:'確認這個人是否被允許 Assume'},
        {aws:'Temporary Credentials',real:'拿到限時的 Production 權限'},
        {aws:'CloudTrail',real:'記錄誰、何時、做了什麼'}
      ],
      memory:'Trust Policy 決定「誰能進」；Permission Policy 決定「進去後能做什麼」。'
    },
    {
      tag:'Auto Scaling',
      title:'案例 3｜EC2 壞掉 vs 貸款活動流量暴增',
      subtitle:'Replacement 與 Scale Out 是兩件不同的事',
      description:'同一個 ASG 可能因為「故障」或「負載」增加 EC2，但原因完全不同。',
      steps:[
        {aws:'ALB Health Check',real:'發現 EC2-A 不健康，停止送流量'},
        {aws:'ASG Replacement',real:'Desired=2、Actual=1，所以補 EC2-C'},
        {aws:'Scaling Metric',real:'另一種情況：兩台都健康，但 Request / CPU 過高'},
        {aws:'Scale Out',real:'Desired 2→3→4，增加 Capacity'},
        {aws:'Instance Warm-up',real:'新 EC2 啟動 Application 後才真正能接流量'}
      ],
      compare:[
        {title:'故障',text:'目標是把容量補回 Desired Capacity。'},
        {title:'流量過高',text:'目標是提高 Desired Capacity，增加服務能力。'}
      ],
      memory:'Replacement = 壞一台補一台；Scale Out = 沒壞，但現在不夠用。'
    },
    {
      tag:'Storage / S3',
      title:'案例 4｜每天產生 Loan Report，保存 7 年',
      subtitle:'Least Privilege、Lifecycle、Versioning 與 Audit',
      description:'情境：Production EC2 每晚產生放款報表，近期常查、長期依法保存。',
      steps:[
        {aws:'EC2 IAM Role',real:'Application 不存長期 Access Key'},
        {aws:'s3:PutObject',real:'只能把 Loan Report 上傳指定 Prefix'},
        {aws:'S3 Standard',real:'近期 30 天頻繁查詢'},
        {aws:'Lifecycle',real:'31 天後自動轉到較便宜的 Storage Class'},
        {aws:'Glacier',real:'長期 1～7 年低頻保存'}
      ],
      compare:[
        {title:'保護',text:'Versioning 防誤覆蓋；SSE-KMS 做靜態資料加密。'},
        {title:'稽核',text:'CloudTrail + S3 Data Events 記錄 Object 操作。'}
      ],
      memory:'Storage Class 不是越便宜越好，要同時看 Retrieval Time、Access Frequency、Retention 與 Cost。'
    },
    {
      tag:'Networking',
      title:'案例 5｜Private EC2 要更新套件',
      subtitle:'NAT Gateway 不是使用者 Request Path',
      description:'情境：Private Subnet 裡的 EC2 要下載 OS / Application Patch。',
      steps:[
        {aws:'Private EC2',real:'沒有直接對 Internet 開放'},
        {aws:'Private Route',real:'0.0.0.0/0 指向 NAT Gateway'},
        {aws:'NAT Gateway',real:'讓 EC2 主動向外連線'},
        {aws:'Internet Gateway',real:'由 Public Subnet 對外進 Internet'},
        {aws:'Vendor / Package Repo',real:'下載 Patch 或套件'}
      ],
      memory:'客戶 Request 不會經 NAT；NAT 是給 Private Resource 主動出 Internet。'
    }
    ,{
      tag:'DR + Storage',
      title:'案例 6｜Loan Audit Report 保存 7 年且跨 Region 保護',
      subtitle:'Retention、Immutability、RPO/RTO 與 Replication 要分開設計',
      description:'情境：Loan Audit Report 必須保存 7 年、管理員不得提前永久刪除，Region Disaster 時最多接受 10 分鐘資料損失、30 分鐘恢復。',
      steps:[
        {aws:'S3 + Versioning',real:'保存 Object 歷史版本，作為 Object Lock 與復原基礎'},
        {aws:'Object Lock Compliance',real:'7 年 Retention 期間不可提前永久刪除受保護 Version'},
        {aws:'SSE-KMS',real:'敏感金融資料使用受控 KMS Key 加密'},
        {aws:'CRR',real:'將新 Object 非同步複寫到另一個 Region'},
        {aws:'CloudTrail Data Events',real:'稽核 Get / Put / Delete 等 Object-level 操作'}
      ],
      compare:[
        {title:'RPO ≤ 10 分鐘',text:'這是 Business Requirement；不能因 S3 RTC 提供 15 分鐘 SLA 就直接宣稱滿足。'},
        {title:'RTO ≤ 30 分鐘',text:'除了資料副本，還必須驗證 Application、DNS、IAM、Runbook 等恢復流程。'}
      ],
      memory:'Retention = 留多久；Object Lock = 能不能刪；RPO = 可掉多少資料；RTO = 可停多久。'
    },
  ],
  glossary: [
    {term:'RTO',fullName:'Recovery Time Objective｜復原時間目標',category:'DR / Reliability',aliases:['復原時間','Recovery Time','多久恢復'],definition:'發生中斷後，業務可以接受「系統最多多久必須恢復服務」。它衡量的是時間，不是資料量。',example:'放款系統 RTO = 30 分鐘：若主系統故障，目標是在 30 分鐘內恢復可用。',confusion:'RTO 問「多久恢復服務」；RPO 問「最多可以損失多少時間範圍的資料」。',related:['RPO','DR','Failover','High Availability']},
    {term:'RPO',fullName:'Recovery Point Objective｜復原點目標',category:'DR / Reliability',aliases:['復原點','Recovery Point','資料損失'],definition:'發生災難時，業務最多可以接受「回到多久以前的資料狀態」，也就是可接受的資料損失時間窗口。',example:'放款系統 RPO = 5 分鐘：災難時最多只能接受最近 5 分鐘資料可能需要重建或遺失。',confusion:'RPO 不是「多久恢復」；那是 RTO。RPO 越小，通常代表資料保護與複寫要求越高。',related:['RTO','Backup','Replication','DR']},
    {term:'High Availability',fullName:'HA｜高可用性',category:'Architecture',aliases:['HA','高可用','Availability'],definition:'透過冗餘、健康檢查與 Failover，降低單一元件故障造成服務中斷的機率與時間。',example:'Loan API 跨兩個 AZ 放 EC2，前方使用 ALB；其中一個 AZ 故障時，另一邊仍能服務。',confusion:'HA 著重「減少中斷」；DR 著重「重大災難後如何恢復」。',related:['Multi-AZ','DR','RTO','Failover']},
    {term:'Multi-AZ',fullName:'Multiple Availability Zones',category:'Architecture',aliases:['跨 AZ','多可用區'],definition:'把服務或冗餘資源分散到同一 Region 的多個 Availability Zone，以降低單一 AZ 故障風險。',example:'EC2 分布 AZ-A / AZ-B；RDS 使用 Multi-AZ，Primary 故障時切換到 Standby。',confusion:'Multi-AZ 不等於 Multi-Region；兩者的成本、延遲、DR 能力不同。',related:['Availability Zone','Multi-Region','RDS Multi-AZ','HA']},
    {term:'Multi-Region',fullName:'跨 AWS Region 架構',category:'Architecture',aliases:['跨區域','多 Region'],definition:'將系統能力分布到兩個以上 AWS Region，用於更大範圍的 Disaster Recovery、Latency 或 Business Continuity 需求。',example:'台灣主要服務在一個 Region，另一 Region 保留 DR 能力；是否需要要由 RTO/RPO 與業務重要性決定。',confusion:'不是「越多 Region 越好」；會增加成本、資料一致性、部署與營運複雜度。',related:['Multi-AZ','DR','RTO','RPO']},
    {term:'VPC',fullName:'Virtual Private Cloud',category:'Networking',aliases:['虛擬私有雲','網路邊界'],definition:'AWS 中邏輯隔離的虛擬網路，可規劃 CIDR、Subnet、Route、Gateway 與安全控制。',example:'銀行 Loan System 的 ALB、EC2、RDS 可部署在同一 VPC 的不同 Public / Private Subnet。',confusion:'VPC 不是單一 Subnet；一個 VPC 通常包含多個 Subnet 與多個 AZ。',related:['Subnet','Route Table','IGW','NAT Gateway']},
    {term:'Public Subnet',fullName:'Public Subnet',category:'Networking',aliases:['公開子網路'],definition:'其 Route Table 具備通往 Internet Gateway 的路由，讓符合條件的資源可以與 Internet 通訊。',example:'Internet-facing ALB、NAT Gateway 通常放在 Public Subnet。',confusion:'Public / Private 的核心差異看 Route；不是看名稱，也不是所有 Public Subnet 資源都一定有 Public IP。',related:['Private Subnet','IGW','Route Table']},
    {term:'Private Subnet',fullName:'Private Subnet',category:'Networking',aliases:['私有子網路'],definition:'沒有直接通往 Internet Gateway 的對外路由，常用於 Application、Database 等不應直接暴露 Internet 的資源。',example:'Loan API EC2 與 RDS 放 Private Subnet；EC2 如需更新套件，可經 NAT Gateway 主動出網。',confusion:'Private 不代表完全不能上 Internet；可以透過 NAT 做 outbound。',related:['Public Subnet','NAT Gateway','RDS','EC2']},
    {term:'IGW',fullName:'Internet Gateway',category:'Networking',aliases:['Internet Gateway','網際網路閘道'],definition:'附加在 VPC 上，提供 VPC 與 Internet 之間的連線能力。',example:'Internet 使用者要進入 Internet-facing ALB，其 Public Subnet Route 會指向 IGW。',confusion:'IGW 不等於 NAT Gateway；Private EC2 主動上網通常先走 NAT。',related:['NAT Gateway','Public Subnet','VPC']},
    {term:'NAT Gateway',fullName:'Network Address Translation Gateway',category:'Networking',aliases:['NAT','Private Egress'],definition:'讓 Private Subnet 裡的資源主動連到 Internet，同時不讓 Internet 直接透過 NAT 主動建立對內連線。',example:'Private EC2 下載 OS Patch：EC2 → NAT Gateway → IGW → Package Repository。',confusion:'NAT 通常不在客戶進站的 Request Path；它主要是 Private Resource 的 outbound。',related:['IGW','Private Subnet','Route Table']},
    {term:'Security Group',fullName:'SG｜Security Group',category:'Security',aliases:['SG','安全群組'],definition:'AWS 資源層級的 Stateful 虛擬防火牆，只定義 Allow Rule。回應流量會被狀態追蹤。',example:'APP-SG 只允許來源 ALB-SG 的 TCP 8080；RDS-SG 只允許 APP-SG 的 3306。',confusion:'SG 是 Stateful + Allow Only；NACL 是 Stateless + Allow / Deny。',related:['NACL','ALB-SG','APP-SG','Least Privilege']},
    {term:'NACL',fullName:'Network Access Control List',category:'Security',aliases:['Network ACL','網路 ACL'],definition:'Subnet 層級的 Stateless 網路存取控制，可設定 Allow 與 Deny，Inbound / Outbound 都需獨立考量。',example:'需要在 Subnet 邊界阻擋特定來源 IP 時，可以評估 NACL。',confusion:'NACL 不會像 SG 一樣自動追蹤連線狀態。',related:['Security Group','Subnet','Stateless']},
    {term:'AWS WAF',fullName:'Web Application Firewall',category:'Security',aliases:['WAF','Web 防火牆'],definition:'針對 HTTP/HTTPS Web Request 套用安全規則，例如 IP、SQL Injection、XSS、Rate-based Rule。',example:'客戶 Request 進入 Loan API 前，WAF 先封鎖異常 IP 或疑似 SQL Injection。',confusion:'WAF 管 Web Request 安全；ALB 主要做 L7 Routing / Load Balancing。',related:['ALB','Security Group','Web Security']},
    {term:'ALB',fullName:'Application Load Balancer',category:'Compute / Networking',aliases:['Application Load Balancer','負載平衡器'],definition:'Layer 7 Load Balancer，依 HTTP/HTTPS Host、Path 等條件把流量分配到健康的 Target。',example:'loan.bank.com/api 的 Request 由 ALB 分配到 AZ-A / AZ-B 的 Loan API EC2。',confusion:'ALB 不負責建立新 EC2；補機與擴縮容是 ASG 的責任。',related:['ASG','Target Group','Health Check','WAF']},
    {term:'EC2',fullName:'Amazon Elastic Compute Cloud',category:'Compute',aliases:['Instance','虛擬機','VM'],definition:'AWS 的虛擬運算 Instance，可執行 Application、API、Batch 等 Workload。',example:'Loan API 跑在 EC2 上，由 ALB 接收流量，ASG 管理其數量。',confusion:'EC2 本身不是 Auto Scaling；ASG 才管理群組容量。',related:['ASG','Launch Template','ALB']},
    {term:'ASG',fullName:'Auto Scaling Group',category:'Compute',aliases:['Auto Scaling','自動擴縮'],definition:'管理 EC2 Instance 的數量、生命週期、Replacement 與 Scale In / Scale Out。',example:'Desired=2；EC2-A 故障剩 1 台，ASG 會補一台回到 2。流量高時也可把 Desired 提高。',confusion:'Replacement 與 Scale Out 都可能新增 EC2，但前者是補回容量，後者是增加容量。',related:['Desired Capacity','Launch Template','Scale Out','Replacement']},
    {term:'Launch Template',fullName:'EC2 Launch Template',category:'Compute',aliases:['LT','啟動範本'],definition:'EC2 的建置藍圖，可定義 AMI、Instance Type、Security Group、IAM Role、Storage、User Data 等。',example:'ASG 補機時依 Launch Template 建立規格一致的新 Loan API EC2。',confusion:'Launch Template 定義「怎麼建機器」；ASG 定義「要幾台、何時增減」。',related:['ASG','EC2','AMI']},
    {term:'Desired Capacity',fullName:'ASG Desired Capacity',category:'Compute',aliases:['Desired','目標容量'],definition:'ASG 在某一時間點希望維持的 Instance 數量，是一個明確數字。',example:'Min=2、Desired=2、Max=6；流量高時 Policy 可把 Desired 調成 3 或 4。',confusion:'Desired 不是 2~3 這種範圍；Min / Max 才是上下限。',related:['ASG','Min Capacity','Max Capacity','Scale Out']},
    {term:'Instance Warm-up',fullName:'Auto Scaling Instance Warm-up',category:'Compute',aliases:['Warm-up','預熱'],definition:'新 EC2 建立後，到 Application 真正初始化完成、能穩定承接流量所需的時間。',example:'Loan API 開機需 4 分鐘，因此 09:00 尖峰若 09:00 才擴容可能太晚。',confusion:'Instance 建立成功不等於 Application 已準備好服務。',related:['Scheduled Scaling','ASG','Health Check']},
    {term:'Scheduled Scaling',fullName:'Scheduled Scaling',category:'Compute',aliases:['排程擴縮','定時擴容'],definition:'在已知固定時間前預先調整 Auto Scaling Capacity。',example:'每天 09:00 登入尖峰，可在 08:55 提前把 Desired Capacity 從 2 提高到 4。',confusion:'Scheduled 適合已知固定時段；Dynamic Scaling 是依即時 Metric 反應。',related:['ASG','Warm-up','Dynamic Scaling']},
    {term:'RequestCountPerTarget',fullName:'ALB RequestCountPerTarget',category:'Compute',aliases:['Request Count','每 Target 請求數'],definition:'反映 ALB 後端每個 Target 平均承接的 Request 數，可作為某些 Web/API Workload 的 Scaling Metric。',example:'CPU 只有 35%，但每台 Loan API Request 很高且 Response Time 變慢，此 Metric 可能比 CPU 更代表負載。',confusion:'不是所有 Workload 都該只看 CPU；Scaling Metric 要對應真正的瓶頸。',related:['Target Tracking','ASG','CPUUtilization']},
    {term:'IAM Role',fullName:'AWS Identity and Access Management Role',category:'IAM',aliases:['Role','IAM 身分'],definition:'可被 User、Service 或其他 Principal Assume 的 AWS Identity，通常搭配 Temporary Credentials 使用。',example:'EC2 掛 LoanReportUploaderRole，取得短期憑證後呼叫 S3 PutObject，不把永久 Access Key 寫進程式。',confusion:'Role 是 Identity；Policy 才定義這個 Identity 可以做什麼。',related:['IAM Policy','Temporary Credentials','AssumeRole']},
    {term:'IAM Policy',fullName:'IAM Permission Policy',category:'IAM',aliases:['Policy','權限政策'],definition:'用 Action、Resource、Condition 等描述允許或拒絕哪些 AWS API 操作。',example:'只允許 s3:PutObject 到 arn:aws:s3:::prod-loan-report/loan/*。',confusion:'Action = 做什麼；Resource = 對哪個資源做。',related:['Action','Resource ARN','Least Privilege']},
    {term:'AssumeRole',fullName:'AWS STS AssumeRole',category:'IAM',aliases:['sts:AssumeRole','切換 Role'],definition:'透過 AWS STS 取得某個 IAM Role 的 Temporary Security Credentials。',example:'Incident Engineer 平常沒有 Prod 權限，故障時 Assume ProductionReadOnlyRole 取得短期讀取權限。',confusion:'有 sts:AssumeRole Permission 還不夠；目標 Role 的 Trust Policy 也必須信任 Caller。',related:['Trust Policy','Temporary Credentials','STS']},
    {term:'Trust Policy',fullName:'Role Trust Policy',category:'IAM',aliases:['信任政策'],definition:'定義哪些 Principal 可以 Assume 這個 IAM Role。',example:'ProductionReadOnlyRole 的 Trust Policy 允許公司 Incident Responder Role，並要求 MFA。',confusion:'Trust Policy 管「誰能進」；Permission Policy 管「進去後能做什麼」。',related:['AssumeRole','Permission Policy','Principal']},
    {term:'Permission Policy',fullName:'IAM Permission Policy',category:'IAM',aliases:['權限政策','Identity Policy'],definition:'定義 Identity 或 Role 可以對 AWS Resource 執行哪些 Action。',example:'ProdReadOnlyRole 可 Describe EC2、讀 CloudWatch，但不可 Stop Instance。',confusion:'不要和 Trust Policy 混在一起：Trust 是誰能 Assume；Permission 是能做什麼。',related:['Trust Policy','IAM Role','Least Privilege']},
    {term:'Temporary Credentials',fullName:'Temporary Security Credentials',category:'IAM',aliases:['臨時憑證','短期憑證','Session Token'],definition:'有有效期限的 Access Key ID、Secret Access Key 與 Session Token，常由 STS / IAM Role 取得。',example:'EC2 IAM Role 自動取得短期 Credential 呼叫 S3，不需寫死永久金鑰。',confusion:'Temporary Credential 仍有 Access Key / Secret，只是短期且通常還包含 Session Token。',related:['IAM Role','STS','AssumeRole']},
    {term:'Least Privilege',fullName:'Principle of Least Privilege',category:'Security / IAM',aliases:['最小權限'],definition:'只授予完成工作所需要的最小 Action、Resource 與範圍，不預先多給權限。',example:'Loan EC2 需求只有上傳報表，就先給 s3:PutObject，不順手加 s3:GetObject。',confusion:'方便不代表要給 AdministratorAccess；Production 通常反而需要更精準。',related:['IAM Policy','Security Group','SCP']},
    {term:'Explicit Deny',fullName:'Explicit Deny',category:'IAM',aliases:['明確拒絕','Deny'],definition:'AWS 權限評估中，明確 Deny 會優先於 Allow。',example:'Role 有 AdministratorAccess，但 SCP Explicit Deny cloudtrail:StopLogging，仍不能停 CloudTrail。',confusion:'Allow 很大不代表能覆蓋 Explicit Deny。',related:['SCP','IAM Policy','Effective Permissions']},
    {term:'SCP',fullName:'Service Control Policy',category:'IAM / Organizations',aliases:['Service Control Policy','Organizations SCP'],definition:'AWS Organizations 層級的 Permission Guardrail，用來限制 Account / OU 可取得的最大權限範圍。',example:'Production OU 的 SCP Deny 關閉 CloudTrail，即使某 Role 有 Admin Allow 也不能執行。',confusion:'SCP 設上限，不直接授予 User / Role 權限，也不是 Authentication。',related:['Explicit Deny','AWS Organizations','IAM Policy']},
    {term:'S3',fullName:'Amazon Simple Storage Service',category:'Storage',aliases:['Object Storage','物件儲存'],definition:'AWS 的 Object Storage，資料以 Object 形式放在 Bucket 中，每個 Object 有 Key 與 Metadata。',example:'每天產生的 Loan Report 上傳到 S3，再用 Lifecycle 轉到較便宜 Storage Class。',confusion:'S3 不是傳統 File System，也不是 RDS Database。',related:['Bucket','Object','Versioning','Lifecycle']},
    {term:'Versioning',fullName:'S3 Versioning',category:'Storage',aliases:['版本控制','歷史版本'],definition:'保留同一 Object Key 的多個版本，用來協助回復誤覆蓋或誤刪。',example:'loan-report.csv 被新版覆蓋後，可從舊 Version 回復。',confusion:'Versioning 不等於完整 Backup；Backup 還要考慮獨立 Recovery、故障域與還原流程。',related:['Backup','S3','Object Lock']},
    {term:'Lifecycle',fullName:'S3 Lifecycle',category:'Storage',aliases:['Lifecycle Policy','生命週期'],definition:'依 Object 年齡或條件自動做 Storage Class Transition 或 Expiration 等生命週期管理。',example:'Loan Report 0–90 天放 Standard，之後轉 Standard-IA，再轉 Glacier Archive。',confusion:'Lifecycle 是自動管理資料生命週期；Versioning 是保存不同版本。',related:['S3 Standard','Standard-IA','Glacier','Versioning']},
    {term:'Standard-IA',fullName:'S3 Standard-Infrequent Access',category:'Storage',aliases:['IA','Infrequent Access'],definition:'適合較低頻存取、但仍需要毫秒級存取的 S3 Storage Class；通常儲存成本較低，但有存取相關費用與條件。',example:'90 天後的 Loan Report 每月偶爾查一次，又不能等數小時 Restore，可以評估 Standard-IA。',confusion:'低頻不代表一定要 Glacier；要先看 Retrieval SLA。',related:['S3 Standard','Glacier','Lifecycle']},
    {term:'Glacier',fullName:'S3 Glacier Storage Classes',category:'Storage',aliases:['Archive','歸檔'],definition:'S3 的 Archive 類 Storage Class，適合長期低頻資料；不同 Glacier 類型有不同 Retrieval Time 與 Cost。',example:'依法保存 1～7 年、幾乎不查的歷史 Loan Report，可依取回時效要求選 Archive Tier。',confusion:'不能只選最便宜的 Tier；還要看 Retrieval Time、取回成本與最低保存條件。',related:['Lifecycle','Standard-IA','Archive']},
    {term:'SSE-KMS',fullName:'Server-Side Encryption with AWS KMS keys',category:'Storage / Security',aliases:['KMS Encryption','S3 KMS'],definition:'由 S3 在伺服器端使用 AWS KMS Key 加密 Object，提供較細的 Key Control、Audit 與 Permission 管理能力。',example:'敏感 Loan Report 使用 SSE-KMS，以符合更嚴格的 Key Governance 與稽核需求。',confusion:'選 SSE-KMS 也會增加 KMS Permission、Key Policy、Request Cost 與營運複雜度。',related:['KMS','S3','Encryption']},
    {term:'CloudTrail',fullName:'AWS CloudTrail',category:'Audit / Security',aliases:['Audit Log','API Audit'],definition:'記錄 AWS Account 中的 API Activity，協助稽核「誰在什麼時間對哪個 AWS Resource 做了什麼」。',example:'Incident 後查 CloudTrail，確認哪個 Role 修改了 Security Group 或 Assume 了 Production Role。',confusion:'CloudTrail 有開不代表所有 S3 Object Get/Put 都自動涵蓋；那涉及 Data Events。',related:['Data Events','Audit','AssumeRole']},
    {term:'Data Events',fullName:'CloudTrail Data Events',category:'Audit / Security',aliases:['S3 Data Events','Object-level Audit'],definition:'CloudTrail 用來記錄高頻資料層操作的 Event 類型，例如 S3 Object-level API。',example:'要稽核誰 GetObject / PutObject / DeleteObject，需要明確設定 S3 Data Events。',confusion:'Management Events 與 Data Events 範圍不同；不能只說「有 CloudTrail」就代表全部 Object 操作都有記。',related:['CloudTrail','S3','Audit']},
    {term:'ARN',fullName:'Amazon Resource Name',category:'IAM',aliases:['Resource ARN','AWS ARN'],definition:'AWS 用來唯一識別 Resource 的標準名稱格式，常出現在 IAM Policy 的 Resource。',example:'S3 Object Resource：arn:aws:s3:::prod-loan-report/loan/*。',confusion:'s3://bucket/path 是 URI 表示法；IAM Resource 通常要 ARN。',related:['IAM Policy','S3','Resource']},
    {term:'RDS',fullName:'Amazon Relational Database Service',category:'Database',aliases:['Relational Database','託管資料庫'],definition:'AWS 託管式關聯式資料庫服務，降低自管 DB OS、Patch、Backup、HA 等基礎營運工作。',example:'Loan Application 透過 RDS Endpoint 連到 RDS MySQL；使用 Multi-AZ 提升 HA。',confusion:'RDS 本身就是 Database Service，不需再畫 RDS → DB。',related:['RDS Multi-AZ','Read Replica','Endpoint']},
    {term:'Read Replica',fullName:'RDS Read Replica',category:'Database',aliases:['讀取副本','Read Scaling'],definition:'建立資料庫的唯讀副本，主要用於分散 Read Workload，也可用於部分 DR / reporting 情境，具體能力依 Engine 而異。',example:'報表查詢量很大時，把部分 Read Traffic 導向 Read Replica，避免壓垮 Primary。',confusion:'Read Replica 主要解決 Read Scaling；Multi-AZ 主要解決 HA / Failover。',related:['RDS','Multi-AZ','Read Scaling']}
    ,{term:'S3 Object Lock',fullName:'Amazon S3 Object Lock｜WORM',category:'Storage / Compliance',aliases:['Object Lock','WORM','不可變更'],definition:'以 Write Once Read Many 模式保護特定 S3 Object Version，在指定 Retention 或 Legal Hold 條件下避免被覆寫或永久刪除。',example:'Loan Audit Report 法規保存 7 年，搭配 Versioning 與 Object Lock 保護每個 Version。',confusion:'Versioning 是保留歷史版本；Object Lock 是讓受保護 Version 在期限內不可被永久刪除。',related:['Versioning','Compliance Mode','Governance Mode','Legal Hold']},
    {term:'Compliance Mode',fullName:'S3 Object Lock Compliance Mode',category:'Storage / Compliance',aliases:['Compliance','合規模式'],definition:'Retention 期間內受保護 Object Version 不能被永久刪除，Retention 不能被縮短，包含 AWS Account Root User。',example:'銀行要求 7 年內任何管理員都不能提前永久刪除稽核資料，可評估 Compliance Mode。',confusion:'Governance Mode 可由具備特定 Bypass 權限的人員繞過；Compliance Mode 更嚴格。',related:['S3 Object Lock','Governance Mode','Retention']},
    {term:'Governance Mode',fullName:'S3 Object Lock Governance Mode',category:'Storage / Compliance',aliases:['Governance','治理模式'],definition:'Retention 期間一般使用者無法刪除受保護 Version，但具備特定 Bypass 權限的人員可在受控條件下繞過。',example:'企業內部需要不可變更保護，但仍保留少數緊急管理例外時可評估 Governance。',confusion:'它不是 Compliance Mode；高權限人員可能有繞過機制。',related:['Compliance Mode','S3 Object Lock','Retention']},
    {term:'Legal Hold',fullName:'S3 Object Lock Legal Hold',category:'Storage / Compliance',aliases:['法律保留','Legal Hold'],definition:'對特定 Object Version 施加無固定到期日的保護，直到被授權的人員解除。',example:'某筆貸款資料進入司法調查，即使原 Retention 期限將到，也可維持 Legal Hold。',confusion:'Retention 有到期時間；Legal Hold 本身沒有固定到期日。',related:['Retention','S3 Object Lock']},
    {term:'CRR',fullName:'S3 Cross-Region Replication',category:'Storage / DR',aliases:['Cross-Region Replication','跨 Region 複寫'],definition:'將 S3 Object 非同步複寫到另一個 AWS Region 的 Bucket，以建立跨 Region 副本。',example:'Region A 的 Loan Report 持續複寫到 Region B，降低單一 Region 災難風險。',confusion:'Replication 不等於完整 Backup；仍要考慮刪除行為、Recovery、權限、KMS 與故障域。',related:['S3 RTC','RPO','Backup','Replication']},
    {term:'S3 RTC',fullName:'S3 Replication Time Control',category:'Storage / DR',aliases:['RTC','Replication Time Control'],definition:'S3 Replication 的時間控制能力，提供較可預測的複寫時間與監控指標；其 SLA 不能直接替代 Business RPO。',example:'若需要更可預測的跨 Region 複寫時間，可評估 RTC；但 RPO ≤ 10 分鐘時不能只用 15 分鐘 SLA 宣稱達標。',confusion:'RTC 是技術能力 / SLA；RPO 是 Business Requirement。',related:['CRR','RPO','Replication']},
  ],
  quizBank: [
    {id:'A01',category:'Architecture',difficulty:'基礎',question:'一個系統要求 99.99% Availability。下列哪個思考順序最像 Solutions Architect？',options:['先選最貴的 AWS 服務','先確認 Requirement、Failure Mode、RTO/RPO，再設計架構','先做 Multi-Region 再說','只看 CPU 使用率'],answer:1,explanation:'SA 應先把需求、限制與故障模式定義清楚，再決定需要 Multi-AZ、Multi-Region 或其他設計。最強架構不等於最適合的架構。',memory:'Requirement → Constraint → Failure Mode → Architecture → Trade-off。'},
    {id:'A02',category:'Architecture',difficulty:'基礎',question:'RDS Multi-AZ 最主要解決哪一個問題？',options:['Read Scaling','Database High Availability / Failover','Internet Routing','Web Application Firewall'],answer:1,explanation:'RDS Multi-AZ 的核心目的是提高資料庫可用性與 Failover 能力；Read Replica 才主要用於讀取擴展。',memory:'Multi-AZ = HA；Read Replica = Read Scaling。'},
    {id:'N01',category:'Networking',difficulty:'基礎',question:'Private Subnet 的 EC2 要主動下載 OS Patch，最典型的出口設計是？',options:['0.0.0.0/0 → Internet Gateway','0.0.0.0/0 → NAT Gateway','直接給 EC2 Public IP','流量先經 RDS'],answer:1,explanation:'Private Subnet 通常把預設路由指向 NAT Gateway，讓內部資源主動連 Internet，同時避免 Internet 主動直接連入 EC2。',memory:'Public → IGW；Private → NAT → IGW。'},
    {id:'N02',category:'Networking',difficulty:'基礎',question:'銀行客戶查詢貸款的主要 Request Path 中，哪個服務通常不在路徑上？',options:['WAF','ALB','NAT Gateway','EC2'],answer:2,explanation:'NAT Gateway 主要處理 Private Resource 主動對外的 Internet Egress，不是 Internet 使用者進入 ALB 的主要 Request Path。',memory:'NAT 是 Private Egress，不是 User Request Hop。'},
    {id:'N03',category:'Networking',difficulty:'中等',question:'Internet-facing ALB 放在 Public Subnet 的主要原因是？',options:['ALB 必須可以建立 EC2','需要接收來自 Internet 的流量','RDS 要經過 ALB','Public Subnet 比 Private Subnet 便宜'],answer:1,explanation:'Internet-facing ALB 需要能透過 VPC 的 Internet connectivity 接收外部流量，因此部署於具有到 IGW 路由的 Public Subnet。',memory:'Public/Private 先看 Route，而不是名字。'},
    {id:'S01',category:'Security',difficulty:'基礎',question:'Security Group 與 NACL 最關鍵的差異之一是？',options:['SG Stateless；NACL Stateful','SG Stateful；NACL Stateless','兩者都只能 Allow','兩者都只能套在 EC2'],answer:1,explanation:'Security Group 是 Stateful 且只支援 Allow；NACL 是 Stateless，可設定 Allow / Deny，且作用於 Subnet 層級。',memory:'SG = Resource + Stateful；NACL = Subnet + Stateless。'},
    {id:'S02',category:'Security',difficulty:'基礎',question:'想封鎖特定惡意 Web/API Request，第一個最該想到哪個 AWS Service？',options:['ALB','AWS WAF','NAT Gateway','RDS Multi-AZ'],answer:1,explanation:'AWS WAF 用於 Web Request 規則，例如 IP、SQL Injection、XSS、Rate-based rules。ALB 負責分流，不是主要 Web Request Security Rule Engine。',memory:'ALB 管流量；WAF 管 Web Request 安全。'},
    {id:'S03',category:'Security',difficulty:'中等',question:'APP-SG 最符合 Least Privilege 的 Inbound Source 是？',options:['0.0.0.0/0','整個公司所有 Private CIDR','ALB-SG','RDS-SG'],answer:2,explanation:'如果只有 ALB 應該能連 Application，APP-SG 可直接引用 ALB-SG，範圍比整段 CIDR 更精準。',memory:'能用 SG Reference，就不要隨便放大 CIDR。'},
    {id:'I01',category:'IAM',difficulty:'基礎',question:'EC2 要上傳報表到 S3，最佳做法通常是？',options:['把 Access Key 寫進 application.properties','使用 EC2 IAM Role','把 Access Key 存進 RDS','建立永久 Admin User'],answer:1,explanation:'EC2 應使用 IAM Role 取得 Temporary Credentials，避免在程式或設定檔保存長期 Access Key。',memory:'Role = 身分；Policy = 權限；Temporary Credentials = 短期憑證。'},
    {id:'I02',category:'IAM',difficulty:'基礎',question:'IAM Policy 中 Action 與 Resource 的關係，哪個正確？',options:['Action=對哪個資源；Resource=做什麼','Action=做什麼；Resource=對哪個資源','兩者都是身分','兩者都代表 Network Route'],answer:1,explanation:'Action 是 API 操作，例如 s3:PutObject；Resource 是操作目標，例如特定 S3 Object ARN。',memory:'Do What = Action；On What = Resource。'},
    {id:'I03',category:'IAM',difficulty:'中等',question:'哪一份 Policy 決定「誰可以 Assume 這個 IAM Role」？',options:['Trust Policy','Permission Policy','Security Group','SCP 一定直接決定'],answer:0,explanation:'Role 的 Trust Policy 指定可信任 Principal；Permission Policy 則決定 Assume 成功後這個 Role 能做什麼。',memory:'Trust = 誰能進；Permission = 進去後能做什麼。'},
    {id:'I04',category:'IAM',difficulty:'中等',question:'Arthur 有 sts:AssumeRole Permission，是否代表一定能 Assume 目標 Role？',options:['一定可以','不一定，目標 Role 的 Trust Policy 也必須允許','只要有 NAT 就可以','只要有 AdministratorAccess 就一定可以'],answer:1,explanation:'Caller 有 sts:AssumeRole 只是其中一側；目標 Role 的 Trust Policy 也必須信任該 Principal，才能完成 AssumeRole。',memory:'Caller 要有 AssumeRole 權；Role 也要 Trust 你。'},
    {id:'I05',category:'IAM',difficulty:'中等',question:'Role 有 AdministratorAccess，但 SCP Explicit Deny cloudtrail:StopLogging，結果會是？',options:['Allow，因為 AdministratorAccess 最大','Deny，因為 Explicit Deny 優先','要看 NAT Gateway','改用 ALB 就能執行'],answer:1,explanation:'AWS 權限評估中 Explicit Deny 會覆蓋 Allow。SCP 是 Organization 層級 Guardrail，即使 Role 本身有 AdministratorAccess 仍可能被擋。',memory:'Explicit Deny > Allow。'},
    {id:'I06',category:'IAM',difficulty:'中等',question:'SCP 最正確的描述是？',options:['直接授予 IAM User 權限','Organization 層級的 Permission Guardrail','用來驗證使用者密碼','只控制 Network Traffic'],answer:1,explanation:'SCP 設定 Organization / OU / Account 的權限邊界或上限，不會直接把權限授予 User 或 Role。',memory:'SCP 設上限，不發權限。'},
    {id:'C01',category:'Compute',difficulty:'基礎',question:'EC2-A 故障，ALB 最主要會做什麼？',options:['建立 EC2-C','停止把流量送到不健康的 Target','修改 Launch Template','自動升級 RDS'],answer:1,explanation:'ALB 使用 Health Check 判斷 Target 健康狀況，並避免將流量送到 unhealthy Target。建立替代 Instance 是 ASG 的工作。',memory:'ALB 停流量；ASG 補機。'},
    {id:'C02',category:'Compute',difficulty:'基礎',question:'ASG Desired=2、Actual=1，最可能發生什麼？',options:['ALB 建立新 EC2','ASG 建立新 EC2 以回到 Desired Capacity','NAT Gateway 增加容量','RDS 建立 Read Replica'],answer:1,explanation:'ASG 會維持 Desired Capacity。如果 Actual 低於 Desired，會依 Launch Template 啟動新的 EC2。',memory:'Desired = 當下想維持幾台。'},
    {id:'C03',category:'Compute',difficulty:'基礎',question:'Launch Template 最主要定義什麼？',options:['EC2 的建置規格','ALB 的 WAF Rule','RDS Backup Policy','S3 Lifecycle'],answer:0,explanation:'Launch Template 可定義 AMI、Instance Type、Security Group、IAM Role、Storage、User Data 等 EC2 建置參數。',memory:'Launch Template = EC2 Build Blueprint。'},
    {id:'C04',category:'Compute',difficulty:'中等',question:'兩台 EC2 都 Healthy，但 CPU 90% 且流量持續上升，新增 EC2 主要屬於？',options:['Replacement','Scale Out','Failover','Backup'],answer:1,explanation:'Instance 沒有故障，只是 Capacity 不足，因此屬於 Scale Out；Replacement 是故障後補回 Desired Capacity。',memory:'Replacement = 壞了補；Scale Out = 不夠用所以加。'},
    {id:'C05',category:'Compute',difficulty:'中等',question:'每天 09:00 都固定有登入尖峰，而 Application Warm-up 要 4 分鐘，較合理做法是？',options:['09:00 CPU 爆掉後才開始 Scale Out','08:55 左右提前準備 Capacity','把 Min 設成 0','只增加 NAT Gateway'],answer:1,explanation:'已知固定尖峰且有 Warm-up 時間，應提前準備容量。Scheduled Scaling 很適合明確可預測的時間型態。',memory:'可預測流量先準備；不可預測流量再反應。'},
    {id:'C06',category:'Compute',difficulty:'中等',question:'RequestCount 很高、Response Time 變慢，但 CPU 只有 35%。是否一定不需要 Scale Out？',options:['一定不需要','不一定，CPU 可能不是最佳 Workload Metric','一定要換 RDS','一定是 WAF 問題'],answer:1,explanation:'Application 可能大量等待 I/O、DB 或下游 API，因此 CPU 不高也可能壓力很大。應選能代表 Workload Capacity 的 Metric，例如 ALBRequestCountPerTarget。',memory:'Scaling Metric 要代表真正的 Workload。'},
    {id:'ST01',category:'Storage',difficulty:'基礎',question:'S3 Versioning 最主要可以幫忙處理哪一類問題？',options:['EC2 CPU 太高','Object 被誤覆蓋或需要回復舊版本','ALB 無法分流','NAT Gateway 故障'],answer:1,explanation:'Versioning 會保存同一 Key 的多個 Version，可用於回復誤覆蓋或部分誤刪情況；但不等於完整 Backup Strategy。',memory:'Versioning = 回歷史版本；Backup = 更完整 Recovery Strategy。'},
    {id:'ST02',category:'Storage',difficulty:'基礎',question:'Production EC2 的需求只有「上傳」Loan Report，Least Privilege 最適合的 Action 是？',options:['s3:*','s3:GetObject + s3:PutObject','s3:PutObject','AdministratorAccess'],answer:2,explanation:'需求只有 Write，就只給 s3:PutObject。不要預先加入目前不存在的 Read 需求。',memory:'需求只有 Write，就不要順手給 Read。'},
    {id:'ST03',category:'Storage',difficulty:'中等',question:'IAM Policy 要限制 S3 Object Resource，哪種寫法比較正確？',options:['s3://prod-loan-report/','arn:aws:s3:::prod-loan-report/loan/*','https://s3.amazonaws.com/prod-loan-report','0.0.0.0/0'],answer:1,explanation:'IAM Resource 應使用 ARN。s3:// 是位置 URI，不是 IAM Policy Resource 的 ARN 表示法。',memory:'S3 URI 是位置；IAM Resource 用 ARN。'},
    {id:'ST04',category:'Storage',difficulty:'中等',question:'CloudTrail 已啟用，是否代表所有 S3 GetObject / PutObject 一定都有被記錄？',options:['一定','不一定，S3 Object 操作屬於 Data Events，需要另外啟用','只有 NAT 存在時才記錄','只有使用 SSE-KMS 才記錄'],answer:1,explanation:'S3 Object-level API 屬於 CloudTrail Data Events。若要完整做 Object Audit，需要明確設定 S3 Data Events。',memory:'CloudTrail 有開 ≠ S3 Data Events 一定有開。'}
    ,{id:'ST05',category:'Storage',difficulty:'中等',question:'銀行要求 S3 稽核資料 7 年內連 Root User 都不能提前永久刪除，最適合哪個設計？',options:['只開 Versioning','Object Lock Governance Mode','Object Lock Compliance Mode','只放 Glacier Deep Archive'],answer:2,explanation:'Compliance Mode 在 Retention 期間內提供更嚴格的不可變更保護，Retention 不能被縮短；Versioning 或 Glacier 本身不等同這種 WORM 保護。',memory:'Root 也不能提前永久刪除 → 想到 Compliance Mode。'},
    {id:'DR01',category:'Architecture',difficulty:'基礎',question:'業務要求「最多損失 5 分鐘資料，30 分鐘內恢復服務」，哪個對應正確？',options:['RTO=5、RPO=30','RPO=5、RTO=30','Retention=5、RTO=30','RPO=30、Retention=5'],answer:1,explanation:'RPO 是可接受的資料損失時間窗口；RTO 是中斷後恢復服務的目標時間。',memory:'RPO 看 Data；RTO 看 Time to Service Recovery。'},
    {id:'DR02',category:'Storage',difficulty:'中等',question:'Region A 的 S3 要持續建立 Region B 副本，最直接的機制是？',options:['S3 Lifecycle','S3 Cross-Region Replication','RDS Multi-AZ','NAT Gateway'],answer:1,explanation:'Cross-Region Replication（CRR）用於跨 Region 非同步複寫 S3 Object。',memory:'CRR = Cross-Region、Asynchronous Replication。'},
    {id:'DR03',category:'Storage',difficulty:'進階',question:'Business RPO 要求 ≤10 分鐘，而 S3 RTC 提供 15 分鐘等級的 Replication SLA。SA 應如何描述？',options:['直接宣稱達標','把 Business RPO 改成 15 分鐘','不能直接宣稱達標，需重新評估資料保護方案','關閉 Versioning'],answer:2,explanation:'Business RPO 是需求，不能由服務規格反向修改。若技術 SLA 無法證明滿足 RPO，就必須重新評估整體寫入、複寫與復原設計。',memory:'Service SLA ≠ Business RPO。'},

  ],
  days: [
    {
      day:1, date:'2026-09-16', topic:'High Availability / RDS', score:72, status:'completed',
      mastered:['Multi-Region 先看 RTO / RPO / Business Criticality / Cost','ALB、ASG、RDS Multi-AZ 的基本角色'],
      corrections:[
        ['不能只回答「用 RDS」','先說原架構風險：MySQL on EC2 需要自行維護 DB OS、Patch、Backup、HA，才導出 RDS。'],
        ['RDS → DB 的畫法不精準','RDS 本身就是託管式 Database Service；Application 通常連 RDS Endpoint。'],
        ['ALB 不負責補機','ALB 管流量與 Health Check；Auto Scaling Group 管 EC2 數量與生命週期。'],
        ['Multi-AZ Standby 不是一般讀取節點','RDS Multi-AZ 主要解決 HA / Failover；Read Replica 才偏向 Read Scaling。']
      ],
      memory:['ALB 管流量；ASG 管機器。','Multi-AZ = HA；Read Replica = Read Scaling。','每放一個 AWS Service，都要能回答：它解決哪個 Requirement / Failure？']
    },
    {
      day:2, date:'2026-09-17', topic:'VPC / Public-Private / NAT', score:84, status:'completed',
      mastered:['Public Subnet 0.0.0.0/0 → IGW','Private Subnet 0.0.0.0/0 → NAT Gateway','NAT 是 Private Egress，不在主 Request Path'],
      corrections:[
        ['Internet-facing ALB 為何放 Public','因為需要接收 Internet Traffic；不是因為「需要雙向」。ALB 也可以是 Internal。'],
        ['RDS Private 的理由','重點是縮小 DB 暴露面，App → RDS 走 Private Network，不需要經 NAT。'],
        ['Request Path 漏 IGW','Internet-facing 架構應理解 Internet → IGW → ALB → Private EC2 → Private RDS。']
      ],
      memory:['IGW = VPC 與 Internet 的 Gateway。','NAT Gateway = 讓 Private Subnet 主動存取 Internet。','Public 直接走 IGW；Private 先走 NAT。']
    },
    {
      day:3, date:'2026-09-18', topic:'Security Group / NACL / WAF', score:88, status:'completed',
      mastered:['SG = Stateful + Allow Only','NACL = Stateless + Allow / Deny','ALB 管流量；WAF 管 Web Request 規則'],
      corrections:[
        ['EC2 / RDS 只寫內網 CIDR','更符合 Least Privilege 的做法：EC2 SG Source = ALB-SG；RDS SG Source = APP-SG。'],
        ['Web/API 惡意流量想到 ALB','應想到 AWS WAF；ALB 是 L7 Load Balancing / Routing，不是 Web 安全規則引擎。']
      ],
      memory:['SG-to-SG 比整段 CIDR 更符合 Least Privilege。','SG = Resource Level；NACL = Subnet Level。']
    },
    {
      day:4, date:'2026-09-20', topic:'IAM / Role / Policy / Least Privilege', score:87, status:'completed',
      mastered:['EC2 優先使用 IAM Role，不把長期 Access Key 寫進程式','Least Privilege：需求只有 Write 就不要順手給 Read'],
      corrections:[
        ['Role 只是在「認身分」','Role 是可被 Assume 的 AWS Identity；Policy 定義可做什麼；實際 API 呼叫使用 Temporary Credentials。'],
        ['Action / Resource 混淆','Action = 做什麼；Resource = 對哪個 AWS Resource 做。'],
        ['IAM Role 畫進 Network Path','IAM 是 Authorization，不是封包必經的 Network Hop。']
      ],
      memory:['Role = 身分；Policy = 權限；Temporary Credentials = 短期憑證。','IAM 決定可不可以做；Network 決定封包怎麼走。']
    },
    {
      day:5, date:'2026-09-22', topic:'AssumeRole / Trust Policy', score:81, status:'completed',
      mastered:['Incident Responder 應使用受控 AssumeRole + MFA + CloudTrail','永久高權限 ≠ 維運方便'],
      corrections:[
        ['sts:AssumeRole 不是 Trust Policy','sts:AssumeRole 是 Action。'],
        ['有 EC2 Read Permission 不代表能 Assume Role','Trust Policy 管誰能 Assume；Permission Policy 管 Assume 後能做什麼。'],
        ['Role / Resource / Action 混用','ProductionReadOnlyRole 是 Role；s3:GetObject 是 Action；Bucket/Object ARN 是 Resource。']
      ],
      memory:['Caller 要有 AssumeRole 權；目標 Role 也要 Trust 你。','Trust = 誰能進；Permission = 進去後能做什麼。']
    },
    {
      day:6, date:'2026-09-23', topic:'Explicit Deny / SCP / AccessDenied', score:83, status:'completed',
      mastered:['Explicit Deny > Allow','AccessDenied 要看整條 Effective Permissions，而不是只看 Role Policy'],
      corrections:[
        ['SCP 說成身分驗證','SCP 是 Organization 層級 Authorization Guardrail，不是 Authentication。'],
        ['AdministratorAccess 為何仍被擋','真正原因是 SCP Explicit Deny 覆蓋 Allow。'],
        ['已知 Role 有 s3:* 還再懷疑 Role 沒權限','應改查 SCP、Bucket Policy、Permissions Boundary、Session Policy、KMS 等。']
      ],
      memory:['Authentication = 你是誰。','Authorization = 你能做什麼。','SCP 設上限，不直接授權。']
    },
    {
      day:7, date:'2026-09-23', topic:'EC2 Auto Scaling / Launch Template', score:86, status:'completed',
      mastered:['ALB / ASG / Launch Template 分工','ALB 停流量；ASG 補機'],
      corrections:[
        ['App Tier 題目回答到 DB / Single-AZ','先定位討論 Layer，再做 Trade-off。'],
        ['99.99% Availability 下夜間 Min=1','ASG 能補機不等於零中斷；Production 通常要在 Failure 前保留跨 AZ 冗餘。'],
        ['上雲都是按流量計價','EC2 Compute 主要依 Instance 運行 / 容量計費；沒流量但 Instance 在跑仍可能產生成本。']
      ],
      memory:['ALB = 流量 + Health Check。','ASG = Capacity + Replacement + Scale In / Out。','Launch Template = EC2 Build Blueprint。']
    },
    {
      day:8, date:'2026-09-24', topic:'Scaling Metric / Warm-up / Scheduled Scaling', score:94, status:'completed',
      mastered:['Replacement vs Scaling','RequestCountPerTarget 不一定比 CPU 差','Scale Out ≠ 新 Capacity 立刻可用'],
      corrections:[
        ['Desired = 2~3','Desired Capacity 在某一時間點是一個明確數字；Min / Max 才是上下限。'],
        ['CPU + RequestCount 當一條 OR Target Tracking','較精準的理解是不同 Metric 建不同 Target Tracking Policy。'],
        ['固定 09:00 尖峰只等 CPU 超標','可預測流量應提前準備 Capacity；固定時點可用 Scheduled Scaling。']
      ],
      memory:['Replacement = 壞一台補一台。','Scale Out = 負載高，提高 Desired。','Warm-up = 新 Instance 出現不代表已可穩定服務。','可預測流量先準備；不可預測流量再反應。']
    },
    {
      day:9, date:'2026-09-26', topic:'S3 / Lifecycle / IAM / Audit', score:92, status:'completed',
      mastered:['Versioning ≠ Backup','Lifecycle = 自動管理資料生命週期','Archive 不能只看每 GB 最低價格','SSE-KMS / CloudTrail 的金融情境思維'],
      corrections:[
        ['只能上傳卻給 s3:GetObject','如果 Requirement 只有上傳，先只給 s3:PutObject。'],
        ['IAM Resource 寫成 s3:// URI','IAM Policy Resource 應使用 ARN，例如 arn:aws:s3:::prod-loan-report/loan/*。'],
        ['90 天～1 年只寫 Storage Class','要依 Access Frequency / Retrieval SLA 指定，例如 Standard-IA 或 Intelligent-Tiering。'],
        ['CloudTrail 有開就一定有 S3 Object Audit','S3 Object Put/Get/Delete 屬於 Data Events，需要明確啟用 S3 Data Events。']
      ],
      memory:['Versioning = 回復歷史版本。','Lifecycle = 自動轉換 Storage Tier。','S3 IAM Resource = ARN，不是 s3:// URI。','CloudTrail 有開 ≠ S3 Data Events 一定有開。']
    }
    ,{
      day:10, date:'2026-09-29', topic:'S3 Object Lock / Replication / RTO-RPO', score:91, status:'completed',
      mastered:['RTO = 恢復服務時間；RPO = 可接受資料損失時間','Object Lock Compliance Mode 適合高強度不可變更需求','S3 CRR 是跨 Region 非同步複寫','Replication 不等於完整 Backup'],
      corrections:[
        ['Replication 只寫 asynchronous replication','機制名稱應明確寫 S3 Cross-Region Replication（CRR）；Asynchronous 是其運作方式。'],
        ['RPO 10 分鐘直接搭 S3 RTC','S3 RTC 的技術 SLA 不能直接證明 Business RPO ≤ 10 分鐘；若需求更嚴格需重新評估資料保護架構。'],
        ['Audit 只寫 CloudTrail','若要追 S3 GetObject / PutObject / DeleteObject 等 Object 操作，要明確啟用 CloudTrail S3 Data Events。'],
        ['Object Lock 說成誰都不能動','更精準：Retention 期間受保護 Object Version 不能被永久刪除，Compliance Mode 的 Retention 不能被縮短；仍可讀取與建立新 Version。']
      ],
      memory:['Retention = 要留多久；Object Lock = 這段期間能不能刪。','RPO = 可以掉多少資料；RTO = 可以停多久。','CRR = 跨 Region 非同步複寫。','RTC 的技術 SLA ≠ 自動滿足更嚴格的 Business RPO。']
    }
  ]
};