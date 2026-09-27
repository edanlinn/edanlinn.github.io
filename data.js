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