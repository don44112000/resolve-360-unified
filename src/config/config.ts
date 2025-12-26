import axios from 'axios';

const SERVICE_NAME = 'unified-service';

/**
 * External config service integration
 * Fetches configuration from a centralized config service based on environment
 * Falls back to local .env file for development
 */

interface ConfigServiceResponse {
  [key: string]: any;
}

/**
 * Load environment variables from external config service
 * This function authenticates with the config service using API key and fetches environment-specific configuration
 *
 * @returns Object containing all configuration values
 */
export const loadEnvFromConfigService = async (): Promise<Record<string, any>> => {
  const nodeEnv = process.env.NODE_ENV;
  const configServiceBaseURL = process.env.CONFIG_SERVICE_URL;
  const configServiceApiKey = process.env.CONFIG_SERVICE_API_KEY;
  if (!nodeEnv || !configServiceBaseURL || !configServiceApiKey) {
    console.warn(
      '[Config] NODE_ENV, CONFIG_SERVICE_URL, CONFIG_SERVICE_API_KEY not set, falling back to local environment variables',
    );
    return process.env;
  }

  console.log(`[Config] Loading configuration for environment: ${nodeEnv}`);

  try {
    // Fetch configuration from external service
    // Endpoint: GET /config/:serviceName/:envName
    const configEndpoint = `${configServiceBaseURL}/config/${SERVICE_NAME}/${nodeEnv}`;

    console.log(`[Config] Fetching configuration from: ${configEndpoint}`);

    const response = await axios.get<ConfigServiceResponse>(configEndpoint, {
      headers: {
        'x-api-key': configServiceApiKey,
      },
      timeout: 10000,
    });

    if (!response.data) {
      throw new Error('Invalid response from config service');
    }

    const configData = response.data;

    // Set all configuration to process.env
    Object.keys(configData).forEach((key) => {
      process.env[key] = String(configData[key]);
    });

    console.log(
      `[Config] Successfully loaded ${Object.keys(configData).length} configuration values`,
    );

    return configData;
  } catch (error) {
    console.error('[Config] Error loading configuration from external service:', error.message);
    console.log('[Config] Falling back to local environment variables');

    // Fallback to local environment variables
    return process.env;
  }
};
