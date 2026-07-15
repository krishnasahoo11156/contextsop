from enum import Enum

from pydantic import BaseModel, Field, field_validator


class VariableType(str, Enum):
    STRING = "string"
    NUMBER = "number"
    BOOLEAN = "boolean"


class StepType(str, Enum):
    COMMAND = "command"
    WARNING = "warning"
    CHECKBOX = "checkbox"
    INPUT = "input"
    VERIFICATION = "verification"


class WorkflowVariable(BaseModel):
    name: str = Field(pattern=r"^[A-Z][A-Z0-9_]*$")
    label: str = Field(min_length=1, max_length=120)
    type: VariableType
    default_value: str = Field(alias="defaultValue", max_length=500)
    validation_regex: str | None = Field(default=None, alias="validationRegex")


class WorkflowMetadata(BaseModel):
    title: str = Field(min_length=1, max_length=180)
    description: str = Field(min_length=1, max_length=2_000)
    target_environment: str | None = Field(default=None, alias="targetEnvironment")
    estimated_duration: int | None = Field(default=None, alias="estimatedDuration", ge=1, le=1_440)


class WorkflowStep(BaseModel):
    id: str = Field(pattern=r"^[a-zA-Z0-9_-]+$")
    type: StepType
    title: str = Field(min_length=1, max_length=180)
    content: str = Field(min_length=1, max_length=10_000)
    payload: dict[str, str] | None = None


class WorkflowDsl(BaseModel):
    version: str = Field(pattern=r"^\d+\.\d+(\.\d+)?$")
    metadata: WorkflowMetadata
    variables: list[WorkflowVariable] = Field(max_length=50)
    steps: list[WorkflowStep] = Field(min_length=1, max_length=500)

    @field_validator("variables")
    @classmethod
    def variable_names_are_unique(cls, variables: list[WorkflowVariable]) -> list[WorkflowVariable]:
        names = [variable.name for variable in variables]
        if len(names) != len(set(names)):
            raise ValueError("Variable names must be unique.")
        return variables
