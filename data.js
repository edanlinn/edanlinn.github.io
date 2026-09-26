window.CLOUD_SA_DATA = {
  updatedAt: '2026-09-26',
  completedDays: 9,
  currentTrack: 'Storage / S3',
  scores: [
    {day:1, score:72},{day:2, score:84},{day:3, score:88},{day:4, score:87},{day:5, score:81},{day:6, score:83},{day:7, score:86},{day:8, score:94},{day:9, score:92}
  ],
  roadmap: [
    'Architecture','Networking','IAM / Security','Compute','Storage','Database','High Availability','DR','Migration','Modernization','Terraform','Docker','Kubernetes','CI/CD','Observability','FinOps','GenAI / Bedrock','GCP 對照'
  ],
  skillMap: {
    summary: [
      {label:'完成訓練', value:'Day 1–9'},
      {label:'目前主題', value:'Storage / S3'},
      {label:'已建立基礎', value:'5 大領域'},
      {label:'下一階段', value:'DR / Database'}
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
        items:['S3 Object Storage','Bucket / Object / Key','Versioning','Lifecycle Policy','S3 Standard','Standard-IA','Glacier 基礎','SSE-KMS','S3 IAM Object ARN','CloudTrail S3 Data Events']
      },
      {
        name:'下一階段', status:'next', statusLabel:'接下來',
        items:['S3 Object Lock / WORM','S3 Replication','RPO / RTO 深化','RDS / Aurora','Multi-AZ / Read Replica 深化','Backup / Disaster Recovery','Migration / Modernization']
      }
    ],
    mastered:['IGW / NAT Gateway','Public / Private Subnet','SG vs NACL','ALB / ASG / Launch Template','Replacement vs Scaling','Instance Warm-up','S3 Versioning','S3 Lifecycle','Least Privilege 基本思維'],
    confused:['Trust Policy vs Permission Policy','SCP vs IAM Permission','Authentication vs Authorization','ALB Health Check vs ASG Replacement','S3 ARN vs s3:// URI','CloudTrail vs S3 Data Events','Versioning vs Backup'],
    upcoming:['Database 深入','Disaster Recovery','Migration','Modernization','Terraform','Docker / Kubernetes','CI/CD','Observability','FinOps','Bedrock / GenAI','GCP Architecture'],
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
  ]
};