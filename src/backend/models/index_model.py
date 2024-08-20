from typing import Protocol

from azure.search.documents.indexes.models import (
    ExhaustiveKnnAlgorithmConfiguration,
    ExhaustiveKnnParameters,
    HnswAlgorithmConfiguration,
    HnswParameters,
    SearchableField,
    SearchField,
    SearchFieldDataType,
    SearchIndex,
    SimpleField,
    VectorSearch,
    VectorSearchAlgorithmKind,
    VectorSearchProfile,
)


class IndexModelCreatorInterface(Protocol):
    def create(self) -> SearchIndex:
        ...


# TODO: example of IndexModelCreatorInterface implementation
class IndexModelCreator:
    """
    Creates a SearchIndex model suitable for Azure Search Service.

    Args:
        index_name (str): The name of the search index to be created.
    """

    def __init__(self, index_name: str) -> None:
        self._index_name = index_name

    def create(self) -> SearchIndex:
        """
        Creates and configures a new SearchIndex object for Azure Search
        Service.

        This method sets up fields for storing document attributes such as ID, content, category,
        etc., and configures vector search features for storing and querying embeddings.

        Returns:
            A configured SearchIndex instance ready for deployment within Azure Search Service.
        """

        fields = [
            SimpleField(name="id", type=SearchFieldDataType.String, key=True),
            SearchableField(
                name="content",
                type=SearchFieldDataType.String,
            ),
            SimpleField(name="category", type=SearchFieldDataType.String),
            SearchableField(
                name="sourcepage",
                type=SearchFieldDataType.String,
                filterable=True,
                facetable=True,
            ),
            SearchableField(
                name="sourcefile",
                type=SearchFieldDataType.String,
                filterable=True,
                facetable=True,
            ),
            SearchField(
                name="content_embeddings",
                type=SearchFieldDataType.Collection(SearchFieldDataType.Single),
                searchable=True,
                vector_search_dimensions=1536,
                vector_search_profile_name="myHnswProfile",
            ),
            SearchableField(
                name="metadata",
                type=SearchFieldDataType.String,
                filterable=True,
                facetable=True,
            ),
        ]

        vector_search = VectorSearch(
            algorithms=[
                HnswAlgorithmConfiguration(
                    name="myHnsw",
                    kind=VectorSearchAlgorithmKind.HNSW,
                    parameters=HnswParameters(
                        m=4, ef_construction=400, ef_search=500, metric="cosine"
                    ),
                ),
                ExhaustiveKnnAlgorithmConfiguration(
                    name="myExhaustiveKnn",
                    kind=VectorSearchAlgorithmKind.EXHAUSTIVE_KNN,
                    parameters=ExhaustiveKnnParameters(metric="cosine"),
                ),
            ],
            profiles=[
                VectorSearchProfile(
                    name="myHnswProfile", algorithm_configuration_name="myHnsw"
                ),
                VectorSearchProfile(
                    name="myExhaustiveKnnProfile",
                    algorithm_configuration_name="myExhaustiveKnn",
                ),
            ],
        )

        return SearchIndex(
            name=self._index_name,
            fields=fields,
            scoring_profiles=[],
            vector_search=vector_search,
        )
