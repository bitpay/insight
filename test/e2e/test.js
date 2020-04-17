const { expect } = require('chai');
const startInsightUI = require('../../lib/test/startInsightUI');
const wait = require('../../lib/test/util/wait');

const topPanel = require('../../lib/test/pages/TopPanel');
const blockPage = require('../../lib/test/pages/BlockPage');
const statusPage = require('../../lib/test/pages/StatusPage');

const InsightUIOptions = require('../../lib/test/service-ctl/InsightUIOptions');

let originalTimeout;

describe('basic UI tests', () => {
  let masterNode;

  let url;
  let blockHash;
  let trxHash;

  beforeAll(async () => {
    const rootPath = process.cwd();

    const insightUIContainerOptions = {
      volumes: [
        `${rootPath}/dashcore-node:/insight/node_modules/@dashevo/insight-ui/dashcore-node`,
        `${rootPath}/po:/insight/node_modules/@dashevo/insight-ui/po`,
        `${rootPath}/public:/insight/node_modules/@dashevo/insight-ui/public`,
      ],
    };

    const insighUIOptions = {
      container: insightUIContainerOptions,
    };

    InsightUIOptions.setDefaultCustomOptions(insighUIOptions);


    [masterNode] = await startInsightUI.many(1);

    url = `http://127.0.0.1:${masterNode.insightUi.options.getUiPort()}/insight/`;

    await masterNode.dashCore.getApi().generate(15);
  });

  afterAll(async () => {
    const instances = [
      masterNode,
    ];

    await Promise.all(instances.filter(i => i)
      .map(i => i.remove()));
  });

  beforeEach(() => {
    originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 250000;
  });

  afterEach(() => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
  });

  describe('Home Page', () => {
    it('should be able to open main page', async () => {
      await browser.get(url);
      const title = await browser.getTitle();
      expect(title).equal('Home | Insight');
    });

    it('should be able to open block page', async () => {
      await topPanel.openBlockPage();
      const title = await browser.getTitle();
      expect(title).equal('Home | Insight');
    });

    it('should be able to open status page', async () => {
      await topPanel.openStatusPage();
      await wait(10000); // time to complete sync
      const title = await browser.getTitle();
      expect(title).equal('Status | Insight');

      const syncProgress = await statusPage.getSyncProgress();
      expect(syncProgress).equal('100% Complete');

      const currentSyncStatus = await statusPage.getCurrentSyncStatus();
      expect(currentSyncStatus).equal('finished');

      const startDate = await statusPage.getStartDate();
      expect(startDate).equal('Invalid date');

      const initialBlockChainHeight = await statusPage.getInitialBlockChainHeight();
      expect(Number.isInteger(parseInt(initialBlockChainHeight, 10))).equal(true);

      const syncedBlocks = await statusPage.getSyncedBlocks();
      expect(syncedBlocks).equal('');

      const skippedBlocks = await statusPage.getSkippedBlocks();
      expect(skippedBlocks).equal('');

      const syncType = await statusPage.getSyncType();
      expect(syncType).equal('bitcore node');

      const lastBlockHash = await statusPage.getLastBlockHash();
      expect(lastBlockHash).not.equal(undefined);

      const currentBlockchainTip = await statusPage.getCurrentBlockchainTip();
      expect(currentBlockchainTip).not.equal(undefined);

      const version = await statusPage.getVersion();
      expect(Number.isInteger(parseInt(version, 10))).equal(true);

      const protocolVersion = await statusPage.getProtocolVersion();
      expect(Number.isInteger(parseInt(protocolVersion, 10))).equal(true);

      const blocks = await statusPage.getBlocks();
      expect(blocks).equal('15');

      const timeOffset = await statusPage.getTimeOffset();
      expect(timeOffset).equal('0');

      const connections = await statusPage.getConnections();
      expect(connections).equal('0');

      const miningDifficulty = await statusPage.getMiningDifficulty();
      expect(miningDifficulty).not.equal('');

      const network = await statusPage.getNetwork();
      expect(network).equal('testnet');

      const proxySetting = await statusPage.getProxySetting();
      expect(proxySetting).equal('');

      const infoErrors = await statusPage.getInfoErrors();
      expect(infoErrors).equal('');
    });
    it('should be able to route to block number', async () => {
      const blockIdToSearch = '12';

      await browser.get(`${url}block/${blockIdToSearch}`);

      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).equal(`${url}block/${blockIdToSearch}`);

      const blockId = (await blockPage.getBlockId()).replace('Block #', '');
      expect(blockId).equal(blockIdToSearch);
      blockHash = await blockPage.getBlockHash();

      const nextBlock = await blockPage.getNextBlock();

      expect(nextBlock).equal(`${parseInt(blockId, 10) + 1}`);
    });
    it('should be able search by block number', async () => {
      const blockIdToSearch = '12';

      topPanel.search(blockIdToSearch);
      const currentUrl = await browser.getCurrentUrl();

      const blockId = (await blockPage.getBlockId()).replace('Block #', '');
      expect(blockId).equal(blockIdToSearch);
      blockHash = await blockPage.getBlockHash();
      // When search from insight search pane, it will redirect to blockHash in url
      expect(currentUrl).equal(`${url}block/${blockHash}`);

      const numberOfTrxs = await blockPage.getNumberOfTrxs();
      expect(numberOfTrxs).equal('1');

      const height = await blockPage.getHeight();
      expect(height).equal(`${blockIdToSearch} (Mainchain)`);

      const blockReward = await blockPage.getBlockReward();
      expect(blockReward).equal('500 DASH');

      const timestamp = await blockPage.getTimestamp();
      expect(timestamp).not.equal('');
      const minedBy = await blockPage.getMinedBy();
      expect(minedBy).equal('');
      const merkleRoot = await blockPage.getMerkleRoot();
      expect(merkleRoot).not.equal('');
      const previousBlock = await blockPage.getPreviousBlock();
      expect(previousBlock).equal(`${parseInt(blockId, 10) - 1}`);
      const difficulty = await blockPage.getDifficulty();
      expect(difficulty).not.equal('');
      const bits = await blockPage.getBits();
      expect(bits).not.equal('');
      const size = await blockPage.getSize();
      expect(size).not.equal('');
      const version = await blockPage.getVersion();
      expect(Number.isInteger(parseInt(version, 10))).equal(true);
      const nonce = await blockPage.getNonce();
      expect(Number.isInteger(parseInt(nonce, 10))).equal(true);
      const nextBlock = await blockPage.getNextBlock();

      expect(nextBlock).equal(`${parseInt(blockId, 10) + 1}`);
      trxHash = await blockPage.getTrxHash();
    });

    it('should be able search by block hash', async () => {
      const blockIdToSearch = '12';
      topPanel.search(blockHash);
      const currentUrl = await browser.getCurrentUrl();
      expect(currentUrl).equal(`${url}block/${blockHash}`);

      const blockId = (await blockPage.getBlockId()).replace('Block #', '');
      expect(blockId).equal(blockIdToSearch);
      expect(await blockPage.getBlockHash()).equal(blockHash);

      const numberOfTrxs = await blockPage.getNumberOfTrxs();
      expect(numberOfTrxs).equal('1');

      const height = await blockPage.getHeight();
      expect(height).equal(`${blockIdToSearch} (Mainchain)`);

      const blockReward = await blockPage.getBlockReward();
      expect(blockReward).equal('500 DASH');

      const timestamp = await blockPage.getTimestamp();
      expect(timestamp).not.equal('');
      const minedBy = await blockPage.getMinedBy();
      expect(minedBy).equal('');
      const merkleRoot = await blockPage.getMerkleRoot();
      expect(merkleRoot).not.equal('');
      const previousBlock = await blockPage.getPreviousBlock();
      expect(previousBlock).equal(`${parseInt(blockId, 10) - 1}`);
      const difficulty = await blockPage.getDifficulty();
      expect(difficulty).not.equal('');
      const bits = await blockPage.getBits();
      expect(bits).not.equal('');
      const size = await blockPage.getSize();
      expect(size).not.equal('');
      const version = await blockPage.getVersion();
      expect(Number.isInteger(parseInt(version, 10))).equal(true);
      const nonce = await blockPage.getNonce();
      expect(Number.isInteger(parseInt(nonce, 10))).equal(true);
      const nextBlock = await blockPage.getNextBlock();
      expect(nextBlock).equal(`${parseInt(blockId, 10) + 1}`);

      expect(await blockPage.getTrxHash()).equal(trxHash);
    });
  });
});
