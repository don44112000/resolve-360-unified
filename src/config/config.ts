import axios from 'axios';
import * as jwt from 'jsonwebtoken';

const SERVICE_ID = 'resolve-360-unified'; // This will be replaced with actual service ID later

/**
 * External config service integration
 * Fetches configuration from a centralized config service based on environment
 * Falls back to local .env file for development
 */

interface ConfigServiceResponse {
    data: Record<string, any>;
}

/**
 * Load environment variables from external config service
 * This function authenticates with the config service and fetches environment-specific configuration
 * 
 * @returns Object containing all configuration values
 */
export const loadEnvFromConfigService = async (): Promise<Record<string, any>> => {
    const nodeEnv = process.env.NODE_ENV || 'dev';
    const configServiceBaseURL = process.env.CONFIG_SERVICE_URL || 'http://config-service:3000';

    console.log(`[Config] Loading configuration for environment: ${nodeEnv}`);

    // For local development, skip external config service
    if (nodeEnv === 'dev' || nodeEnv === 'development') {
        console.log('[Config] Using local .env file for development');
        return process.env;
    }

    try {
        // Step 1: Generate JWT token for authentication with config service
        const configServiceSecret = process.env.CONFIG_SERVICE_JWT_SECRET || 'default_secret';
        const token = jwt.sign(
            {
                serviceId: SERVICE_ID,
                environment: nodeEnv,
                timestamp: Date.now(),
            },
            configServiceSecret,
            { expiresIn: '5m' }
        );

        // Step 2: Fetch configuration from external service
        const configEndpoint = `${configServiceBaseURL}/api/config/${SERVICE_ID}/${nodeEnv}`;

        console.log(`[Config] Fetching configuration from: ${configEndpoint}`);

        const response = await axios.get<ConfigServiceResponse>(configEndpoint, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            timeout: 10000,
        });

        if (!response.data || !response.data.data) {
            throw new Error('Invalid response from config service');
        }

        const configData = response.data.data;

        // Step 3: Set all configuration to process.env
        Object.keys(configData).forEach((key) => {
            process.env[key] = configData[key];
        });

        console.log(`[Config] Successfully loaded ${Object.keys(configData).length} configuration values`);

        return configData;

    } catch (error) {
        console.error('[Config] Error loading configuration from external service:', error.message);
        console.log('[Config] Falling back to local environment variables');

        // Fallback to local environment variables
        return process.env;
    }
};
