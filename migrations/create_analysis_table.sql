-- Create enum for analysis status
CREATE TYPE analysis_status AS ENUM ('pending', 'processing', 'completed', 'failed');

-- Create table for storing analyses
CREATE TABLE IF NOT EXISTS analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assessment_id UUID NOT NULL REFERENCES assessments(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status analysis_status NOT NULL DEFAULT 'pending',
    overall_risk_score NUMERIC(3,1),
    business_risk_score NUMERIC(3,1),
    financial_risk_score NUMERIC(3,1),
    market_risk_score NUMERIC(3,1),
    swot_risk_score NUMERIC(3,1),
    analysis_content JSONB NOT NULL,
    pdf_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    error_message TEXT,
    CONSTRAINT valid_risk_score CHECK (
        overall_risk_score >= 0 AND overall_risk_score <= 10 AND
        business_risk_score >= 0 AND business_risk_score <= 10 AND
        financial_risk_score >= 0 AND financial_risk_score <= 10 AND
        market_risk_score >= 0 AND market_risk_score <= 10 AND
        swot_risk_score >= 0 AND swot_risk_score <= 10
    )
);

-- Create index for faster queries
CREATE INDEX idx_analyses_assessment_id ON analyses(assessment_id);
CREATE INDEX idx_analyses_user_id ON analyses(user_id);

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update timestamp
CREATE TRIGGER update_analyses_updated_at
    BEFORE UPDATE ON analyses
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column(); 