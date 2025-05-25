export interface ISeeder {
  seed(): Promise<void>;
  clear(): Promise<void>;
  shouldSeed(): Promise<boolean>;
}